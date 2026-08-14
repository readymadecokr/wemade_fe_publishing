import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminKeyProcedure, publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { users, memberRestrictionHistories, banners, news, media, products, payments, pointLogs, coupons, couponUses, admins, statsEvents, games } from "../drizzle/schema";
import { ruCashProducts, ruCashBalances, ruCashTransactions } from "../drizzle/schema";
import { storagePut } from "./storage";
import { asc, desc, eq, gte, like, lt, or, sql } from "drizzle-orm";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // 공개 미디어 목록 (Home.tsx에서 사용)
  publicMedia: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(media).where(eq(media.isActive, 1)).orderBy(asc(media.sortOrder), asc(media.id));
    }),
  }),

  // 공개 배너 목록 (Home.tsx에서 사용)
  banner: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      const result = await db
        .select()
        .from(banners)
        .where(eq(banners.isActive, 1))
        .orderBy(asc(banners.sortOrder), asc(banners.id));
      return result;
    }),
  }),

  user: router({
    // 탈퇴 처리 — withdrawnAt 저장
    withdraw: publicProcedure.mutation(async ({ ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.update(users).set({ withdrawnAt: new Date() }).where(eq(users.openId, ctx.user.openId));
      return { success: true };
    }),
  }),

  guest: router({
    // 게스트 회원가입 — 닉네임을 DB에 저장
    register: publicProcedure
      .input(
        z.object({
          nickname: z.string().min(1).max(50),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // 게스트 openId는 닉네임 기반으로 생성 (충돌 시 다시 시도)
        const openId = `guest_${input.nickname}_${Date.now()}`;

        await db.insert(users).values({
          openId,
          name: input.nickname,
          loginMethod: "guest",
          role: "user",
          lastSignedIn: new Date(),
        });

        return { success: true, openId };
      }),
  }),

  admin: router({
    // 회원 목록 조회 (페이지네이션, 검색, 정렬)
    listUsers: adminKeyProcedure
      .input(
        z.object({
          page: z.number().int().min(1).default(1),
          pageSize: z.number().int().min(1).max(100).default(20),
          search: z.string().optional(),
          sortBy: z.enum(["id", "name", "email", "createdAt", "lastSignedIn", "role"]).default("createdAt"),
          sortOrder: z.enum(["asc", "desc"]).default("desc"),
          roleFilter: z.enum(["all", "user", "admin"]).default("all"),
          statusFilter: z.enum(["all", "active", "suspended", "banned", "restricted"]).default("all"),
          searchField: z.enum(["name", "id", "csCode"]).default("name"),
          registrationStartDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
          registrationEndDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        })
      )
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // 이전 버전에서 CS Code가 저장되지 않은 제재 회원은 목록 조회 시 1회 보완한다.
        // 새 제재 건은 memberAdmin.suspend에서 발급된 CS Code를 그대로 보존한다.
        await db.update(users)
          .set({ csCode: sql`CONCAT('9', LPAD(CAST(${users.id} AS CHAR), 10, '0'))` })
          .where(sql`${users.status} IN ('suspended', 'banned') AND (${users.csCode} IS NULL OR ${users.csCode} = '')`);

        const { page, pageSize, search, sortBy, sortOrder, roleFilter, statusFilter, searchField, registrationStartDate, registrationEndDate } = input;
        const offset = (page - 1) * pageSize;

        const whereConditions: unknown[] = [];

        if (search && search.trim()) {
          const searchTerm = `%${search.trim()}%`;
          if (searchField === "id") {
            whereConditions.push(like(sql<string>`CAST(${users.id} AS CHAR)`, searchTerm));
          } else if (searchField === "csCode") {
            whereConditions.push(like(users.csCode, searchTerm));
          } else {
            whereConditions.push(like(users.name, searchTerm));
          }
        }

        if (roleFilter !== "all") {
          whereConditions.push(eq(users.role, roleFilter));
        }

        if (statusFilter === "restricted") {
          whereConditions.push(or(eq(users.status, "suspended"), eq(users.status, "banned")));
        } else if (statusFilter !== "all") {
          whereConditions.push(eq(users.status, statusFilter));
        }

        if (registrationStartDate) {
          whereConditions.push(gte(users.createdAt, new Date(`${registrationStartDate}T00:00:00+09:00`)));
        }
        if (registrationEndDate) {
          const endExclusive = new Date(`${registrationEndDate}T00:00:00+09:00`);
          endExclusive.setDate(endExclusive.getDate() + 1);
          whereConditions.push(lt(users.createdAt, endExclusive));
        }

        const sortColumnMap = {
          id: users.id,
          name: users.name,
          email: users.email,
          createdAt: users.createdAt,
          lastSignedIn: users.lastSignedIn,
          role: users.role,
        };
        const sortColumn = sortColumnMap[sortBy];
        const orderFn = sortOrder === "asc" ? asc : desc;

        let countQuery = db.select({ count: sql<number>`count(*)` }).from(users);
        if (whereConditions.length === 1) {
          countQuery = countQuery.where(whereConditions[0] as ReturnType<typeof eq>) as typeof countQuery;
        } else if (whereConditions.length > 1) {
          const { and } = await import("drizzle-orm");
          countQuery = countQuery.where(and(...(whereConditions as ReturnType<typeof eq>[]))) as typeof countQuery;
        }
        const countResult = await countQuery;
        const total = Number(countResult[0]?.count ?? 0);

        let dataQuery = db
          .select({
            id: users.id,
            openId: users.openId,
            name: users.name,
            email: users.email,
            loginMethod: users.loginMethod,
            role: users.role,
            status: users.status,
            suspendedUntil: users.suspendedUntil,
            suspendReason: users.suspendReason,
            csCode: users.csCode,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
            lastSignedIn: users.lastSignedIn,
          })
          .from(users)
          .orderBy(orderFn(sortColumn))
          .limit(pageSize)
          .offset(offset);

        if (whereConditions.length === 1) {
          dataQuery = dataQuery.where(whereConditions[0] as ReturnType<typeof eq>) as typeof dataQuery;
        } else if (whereConditions.length > 1) {
          const { and } = await import("drizzle-orm");
          dataQuery = dataQuery.where(and(...(whereConditions as ReturnType<typeof eq>[]))) as typeof dataQuery;
        }

        const data = await dataQuery;

        return {
          data,
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize),
        };
      }),

    // 회원 상세 조회
    getUser: adminKeyProcedure
      .input(z.object({ id: z.number().int() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db
          .select()
          .from(users)
          .where(eq(users.id, input.id))
          .limit(1);

        if (result.length === 0) throw new Error("User not found");
        return result[0];
      }),

    // 회원 역할 변경
    updateUserRole: adminKeyProcedure
      .input(
        z.object({
          id: z.number().int(),
          role: z.enum(["user", "admin"]),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        await db
          .update(users)
          .set({ role: input.role, updatedAt: new Date() })
          .where(eq(users.id, input.id));

        return { success: true };
      }),

    // 배너 이미지 업로드 (base64 → S3)
    uploadBannerImage: adminKeyProcedure
      .input(z.object({
        base64: z.string(), // data:image/...;base64,...
        filename: z.string().default("banner.jpg"),
      }))
      .mutation(async ({ input }) => {
        const { base64, filename } = input;
        // base64 데이터 파싱
        const matches = base64.match(/^data:([^;]+);base64,(.+)$/);
        if (!matches) throw new Error("Invalid base64 image data");
        const contentType = matches[1];
        const buffer = Buffer.from(matches[2], "base64");
        if (buffer.length > 500 * 1024) throw new Error("파일 용량이 500KB를 초과합니다.");
        const { url } = await storagePut(`banners/${filename}`, buffer, contentType);
        return { url };
      }),

    // 배너 목록 조회
    listBanners: adminKeyProcedure.query(async () => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const result = await db.select().from(banners).orderBy(asc(banners.sortOrder), asc(banners.id));
      return result;
    }),

    // 배너 생성
    createBanner: adminKeyProcedure
      .input(z.object({
        title: z.string().min(1).max(255),
        imageUrl: z.string().min(1),
        imageKey: z.string().optional(),
        actionType: z.enum(["url", "content"]),
        actionUrl: z.string().optional(),
        contentTitle: z.string().optional(),
        contentDate: z.string().optional(),
        contentBody: z.string().optional(),
        sortOrder: z.number().int().default(0),
        isActive: z.number().int().default(1),
        startDate: z.string().optional().nullable(),
        endDate: z.string().optional().nullable(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.insert(banners).values(input);
        return { success: true };
      }),

    // 배너 수정
    updateBanner: adminKeyProcedure
      .input(z.object({
        id: z.number().int(),
        title: z.string().min(1).max(255).optional(),
        imageUrl: z.string().optional(),
        imageKey: z.string().optional(),
        actionType: z.enum(["url", "content"]).optional(),
        actionUrl: z.string().optional().nullable(),
        contentTitle: z.string().optional().nullable(),
        contentDate: z.string().optional().nullable(),
        contentBody: z.string().optional().nullable(),
        sortOrder: z.number().int().optional(),
        isActive: z.number().int().optional(),
        startDate: z.string().optional().nullable(),
        endDate: z.string().optional().nullable(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const { id, ...rest } = input;
        await db.update(banners).set({ ...rest, updatedAt: new Date() }).where(eq(banners.id, id));
        return { success: true };
      }),

    // 배너 삭제
    deleteBanner: adminKeyProcedure
      .input(z.object({ id: z.number().int() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.delete(banners).where(eq(banners.id, input.id));
        return { success: true };
      }),

    // 통계 정보
    stats: adminKeyProcedure.query(async () => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const totalResult = await db.select({ count: sql<number>`count(*)` }).from(users);
      const adminResult = await db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.role, "admin"));
      const todayResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(users)
        .where(sql`DATE(${users.createdAt}) = CURDATE()`);
      const activeResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(users)
        .where(sql`${users.lastSignedIn} >= DATE_SUB(NOW(), INTERVAL 30 DAY)`);

      return {
        total: Number(totalResult[0]?.count ?? 0),
        admins: Number(adminResult[0]?.count ?? 0),
        newToday: Number(todayResult[0]?.count ?? 0),
        activeMonth: Number(activeResult[0]?.count ?? 0),
      };
    }),
  }),

  // ===== NEWS =====
  news: router({
    list: adminKeyProcedure
      .input(z.object({ search: z.string().optional(), page: z.number().default(1), pageSize: z.number().default(20) }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return { items: [], total: 0 };
        const offset = (input.page - 1) * input.pageSize;
        let q = db.select().from(news).$dynamic();
        if (input.search) q = q.where(or(like(news.title, `%${input.search}%`), like(news.content ?? news.title, `%${input.search}%`)));
        const items = await q.orderBy(asc(news.sortOrder), asc(news.id)).limit(input.pageSize).offset(offset);
        const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(news);
        return { items, total: Number(count) };
      }),
    create: adminKeyProcedure
      .input(z.object({ title: z.string(), category: z.string().default('Update'), summary: z.string().optional(), content: z.string().optional(), imageUrl: z.string().optional(), isActive: z.number().default(1), sortOrder: z.number().optional(), publishedAt: z.string().optional() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('DB unavailable');
        let sortOrder = input.sortOrder;
        if (sortOrder === undefined || sortOrder === null) {
          const [{ maxOrder }] = await db.select({ maxOrder: sql<number>`COALESCE(MAX(sortOrder), 0)` }).from(news);
          sortOrder = Number(maxOrder) + 10;
        }
        const result = await db.insert(news).values({ ...input, sortOrder, publishedAt: input.publishedAt ? new Date(input.publishedAt) : new Date() });
        return { id: (result as any).insertId };
      }),
    update: adminKeyProcedure
      .input(z.object({ id: z.number(), title: z.string().optional(), category: z.string().optional(), summary: z.string().optional(), content: z.string().optional(), imageUrl: z.string().optional(), isActive: z.number().optional(), sortOrder: z.number().optional(), publishedAt: z.string().optional() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('DB unavailable');
        const { id, publishedAt, ...rest } = input;
        const updateData: Record<string, unknown> = { ...rest };
        if (publishedAt) updateData.publishedAt = new Date(publishedAt);
        await db.update(news).set(updateData).where(eq(news.id, id));
        return { success: true };
      }),
    delete: adminKeyProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('DB unavailable');
        await db.delete(news).where(eq(news.id, input.id));
        return { success: true };
      }),
  }),

  // ===== MEDIA =====
  mediaAdmin: router({
    list: adminKeyProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(media).orderBy(asc(media.sortOrder), asc(media.id));
    }),
    create: adminKeyProcedure
      .input(z.object({ title: z.string(), youtubeUrl: z.string(), description: z.string().optional(), sortOrder: z.number().default(0), isActive: z.number().default(1) }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('DB unavailable');
        const result = await db.insert(media).values(input);
        return { id: (result as any).insertId };
      }),
    update: adminKeyProcedure
      .input(z.object({ id: z.number(), title: z.string().optional(), youtubeUrl: z.string().optional(), description: z.string().optional(), sortOrder: z.number().optional(), isActive: z.number().optional() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('DB unavailable');
        const { id, ...rest } = input;
        await db.update(media).set(rest).where(eq(media.id, id));
        return { success: true };
      }),
    delete: adminKeyProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('DB unavailable');
        await db.delete(media).where(eq(media.id, input.id));
        return { success: true };
      }),
  }),

  // ===== PRODUCTS (인앱상품) =====
  products: router({
    list: adminKeyProcedure
      .input(z.object({ search: z.string().optional(), page: z.number().default(1), pageSize: z.number().default(20) }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return { items: [], total: 0 };
        const offset = (input.page - 1) * input.pageSize;
        let q = db.select().from(products).$dynamic();
        if (input.search) q = q.where(like(products.name, `%${input.search}%`));
        const items = await q.orderBy(asc(products.sortOrder), asc(products.id)).limit(input.pageSize).offset(offset);
        const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(products);
        return { items, total: Number(count) };
      }),
    create: adminKeyProcedure
      .input(z.object({ name: z.string(), description: z.string().optional(), price: z.string(), currency: z.string().default('USD'), pointAmount: z.number().default(0), imageUrl: z.string().optional(), isActive: z.number().default(1), sortOrder: z.number().default(0) }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('DB unavailable');
        const result = await db.insert(products).values(input as any);
        return { id: (result as any).insertId };
      }),
    update: adminKeyProcedure
      .input(z.object({ id: z.number(), name: z.string().optional(), description: z.string().optional(), price: z.string().optional(), currency: z.string().optional(), pointAmount: z.number().optional(), imageUrl: z.string().optional(), isActive: z.number().optional(), sortOrder: z.number().optional() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('DB unavailable');
        const { id, ...rest } = input;
        await db.update(products).set(rest as any).where(eq(products.id, id));
        return { success: true };
      }),
    delete: adminKeyProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('DB unavailable');
        await db.delete(products).where(eq(products.id, input.id));
        return { success: true };
      }),
  }),

  // ===== PAYMENTS & POINTS =====
  payments: router({
    list: adminKeyProcedure
      .input(z.object({ search: z.string().optional(), status: z.string().optional(), page: z.number().default(1), pageSize: z.number().default(20) }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return { items: [], total: 0 };
        const offset = (input.page - 1) * input.pageSize;
        const items = await db.select({ payment: payments, user: { id: users.id, name: users.name, openId: users.openId } })
          .from(payments).leftJoin(users, eq(payments.userId, users.id))
          .orderBy(desc(payments.createdAt)).limit(input.pageSize).offset(offset);
        const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(payments);
        return { items, total: Number(count) };
      }),
    refund: adminKeyProcedure
      .input(z.object({ id: z.number(), reason: z.string().optional() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('DB unavailable');
        await db.update(payments).set({ status: 'refunded', refundReason: input.reason ?? '' }).where(eq(payments.id, input.id));
        return { success: true };
      }),
    pointList: adminKeyProcedure
      .input(z.object({ userId: z.number().optional(), page: z.number().default(1), pageSize: z.number().default(20) }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return { items: [], total: 0 };
        const offset = (input.page - 1) * input.pageSize;
        let q = db.select().from(pointLogs).$dynamic();
        if (input.userId) q = q.where(eq(pointLogs.userId, input.userId));
        const items = await q.orderBy(desc(pointLogs.createdAt)).limit(input.pageSize).offset(offset);
        const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(pointLogs);
        return { items, total: Number(count) };
      }),
    grantPoint: adminKeyProcedure
      .input(z.object({ userId: z.number(), type: z.enum(['paid', 'free']), amount: z.number(), reason: z.string().optional() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('DB unavailable');
        await db.insert(pointLogs).values(input);
        return { success: true };
      }),
  }),

  // ===== COUPONS =====
  coupons: router({
    list: adminKeyProcedure
      .input(z.object({ search: z.string().optional(), page: z.number().default(1), pageSize: z.number().default(20) }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return { items: [], total: 0 };
        const offset = (input.page - 1) * input.pageSize;
        let q = db.select().from(coupons).$dynamic();
        if (input.search) q = q.where(like(coupons.name, `%${input.search}%`));
        const items = await q.orderBy(desc(coupons.createdAt)).limit(input.pageSize).offset(offset);
        const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(coupons);
        return { items, total: Number(count) };
      }),
    create: adminKeyProcedure
      .input(z.object({ code: z.string(), name: z.string(), benefitType: z.enum(['point', 'product']).default('point'), benefitValue: z.number().default(0), maxUses: z.number().default(1), expiresAt: z.string().optional(), isActive: z.number().default(1) }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('DB unavailable');
        const result = await db.insert(coupons).values({ ...input, expiresAt: input.expiresAt ? new Date(input.expiresAt) : undefined });
        return { id: (result as any).insertId };
      }),
    update: adminKeyProcedure
      .input(z.object({ id: z.number(), name: z.string().optional(), maxUses: z.number().optional(), expiresAt: z.string().optional(), isActive: z.number().optional() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('DB unavailable');
        const { id, expiresAt, ...rest } = input;
        const updateData: Record<string, unknown> = { ...rest };
        if (expiresAt) updateData.expiresAt = new Date(expiresAt);
        await db.update(coupons).set(updateData).where(eq(coupons.id, id));
        return { success: true };
      }),
    delete: adminKeyProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('DB unavailable');
        await db.delete(coupons).where(eq(coupons.id, input.id));
        return { success: true };
      }),
    usageList: adminKeyProcedure
      .input(z.object({ couponId: z.number().optional(), used: z.boolean().optional(), page: z.number().default(1), pageSize: z.number().default(20) }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return { items: [], total: 0 };
        const offset = (input.page - 1) * input.pageSize;
        if (input.used === false) {
          // 미사용 쿠폰 = 발행된 쿠폰 중 usedCount < maxUses
          const items = await db.select().from(coupons).where(sql`${coupons.usedCount} < ${coupons.maxUses}`).limit(input.pageSize).offset(offset);
          const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(coupons).where(sql`${coupons.usedCount} < ${coupons.maxUses}`);
          return { items, total: Number(count) };
        }
        const items = await db.select({ use: couponUses, user: { id: users.id, name: users.name }, coupon: { name: coupons.name, code: coupons.code } })
          .from(couponUses).leftJoin(users, eq(couponUses.userId, users.id)).leftJoin(coupons, eq(couponUses.couponId, coupons.id))
          .orderBy(desc(couponUses.usedAt)).limit(input.pageSize).offset(offset);
        const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(couponUses);
        return { items, total: Number(count) };
      }),
  }),

  // ===== STATS =====
  stats: router({
    summary: adminKeyProcedure
      .input(z.object({ eventType: z.string(), startDate: z.string().optional(), endDate: z.string().optional() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        let q = db.select({ date: sql<string>`DATE(${statsEvents.createdAt})`, count: sql<number>`count(*)` })
          .from(statsEvents).where(eq(statsEvents.eventType, input.eventType)).$dynamic();
        if (input.startDate) q = q.where(sql`${statsEvents.createdAt} >= ${input.startDate}`);
        if (input.endDate) q = q.where(sql`${statsEvents.createdAt} <= ${input.endDate}`);
        return q.groupBy(sql`DATE(${statsEvents.createdAt})`).orderBy(sql`DATE(${statsEvents.createdAt})`);
      }),
    totalByType: adminKeyProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select({ eventType: statsEvents.eventType, count: sql<number>`count(*)` })
        .from(statsEvents).groupBy(statsEvents.eventType);
    }),
  }),

  // ===== ADMIN ACCOUNTS =====
  adminAccounts: router({
    list: adminKeyProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select({ id: admins.id, username: admins.username, displayName: admins.displayName, permissions: admins.permissions, isActive: admins.isActive, createdAt: admins.createdAt, lastLoginAt: admins.lastLoginAt }).from(admins).orderBy(asc(admins.id));
    }),
    create: adminKeyProcedure
      .input(z.object({ username: z.string(), password: z.string(), displayName: z.string().optional(), permissions: z.string().optional() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('DB unavailable');
        // simple hash for demo — in production use bcrypt
        const passwordHash = Buffer.from(input.password).toString('base64');
        const result = await db.insert(admins).values({ username: input.username, passwordHash, displayName: input.displayName, permissions: input.permissions });
        return { id: (result as any).insertId };
      }),
    update: adminKeyProcedure
      .input(z.object({ id: z.number(), displayName: z.string().optional(), permissions: z.string().optional(), isActive: z.number().optional(), password: z.string().optional() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('DB unavailable');
        const { id, password, ...rest } = input;
        const updateData: Record<string, unknown> = { ...rest };
        if (password) updateData.passwordHash = Buffer.from(password).toString('base64');
        await db.update(admins).set(updateData).where(eq(admins.id, id));
        return { success: true };
      }),
    delete: adminKeyProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('DB unavailable');
        await db.delete(admins).where(eq(admins.id, input.id));
        return { success: true };
      }),
  }),

  // ===== MEMBER MANAGEMENT (확장) =====
  memberAdmin: router({
    suspend: adminKeyProcedure
      .input(z.object({ userId: z.number(), status: z.enum(['active', 'suspended', 'banned']), suspendedUntil: z.string().optional(), reason: z.string().optional(), csCode: z.string().max(32).optional() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('DB unavailable');
        const existing = await db.select({ csCode: users.csCode }).from(users).where(eq(users.id, input.userId)).limit(1);
        const generatedCsCode = `${Date.now()}${Math.floor(100 + Math.random() * 900)}`;
        // 새 제재 조치에는 새 CS Code를 발급한다. 기존 이력 행의 CS Code는 변경하지 않는다.
        const issuedCsCode = input.status === 'active'
          ? null
          : (!input.csCode || input.csCode === existing[0]?.csCode ? generatedCsCode : input.csCode);
        const historyCsCode = input.status === 'active' ? existing[0]?.csCode ?? null : issuedCsCode;
        const suspendedUntil = input.suspendedUntil ? new Date(input.suspendedUntil) : null;
        await db.update(users).set({ status: input.status, suspendedUntil, suspendReason: input.reason ?? null, csCode: issuedCsCode }).where(eq(users.id, input.userId));
        await db.insert(memberRestrictionHistories).values({ userId: input.userId, status: input.status, csCode: historyCsCode, reason: input.reason ?? null, suspendedUntil });
        return { success: true, csCode: issuedCsCode };
      }),
    restrictionHistory: adminKeyProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('DB unavailable');
        const historyFields = {
          id: memberRestrictionHistories.id,
          status: memberRestrictionHistories.status,
          csCode: memberRestrictionHistories.csCode,
          reason: memberRestrictionHistories.reason,
          suspendedUntil: memberRestrictionHistories.suspendedUntil,
          appliedAt: memberRestrictionHistories.appliedAt,
        };
        const histories = await db.select(historyFields).from(memberRestrictionHistories).where(eq(memberRestrictionHistories.userId, input.userId)).orderBy(desc(memberRestrictionHistories.appliedAt));
        const [currentUser] = await db.select({
          status: users.status,
          csCode: users.csCode,
          suspendReason: users.suspendReason,
          suspendedUntil: users.suspendedUntil,
          updatedAt: users.updatedAt,
        }).from(users).where(eq(users.id, input.userId)).limit(1);

        const isRestricted = currentUser?.status === 'suspended' || currentUser?.status === 'banned';
        const currentCode = currentUser?.csCode || (isRestricted ? `${Date.now()}${String(input.userId).padStart(3, '0')}` : null);
        const currentActionExists = isRestricted && histories.some(item => item.status === currentUser?.status && item.csCode === currentCode);

        if (isRestricted && currentCode && !currentActionExists && currentUser) {
          if (!currentUser.csCode) {
            await db.update(users).set({ csCode: currentCode }).where(eq(users.id, input.userId));
          }
          await db.insert(memberRestrictionHistories).values({
            userId: input.userId,
            status: currentUser.status,
            csCode: currentCode,
            reason: currentUser.suspendReason,
            suspendedUntil: currentUser.suspendedUntil,
            appliedAt: currentUser.updatedAt,
          });
          return db.select(historyFields).from(memberRestrictionHistories).where(eq(memberRestrictionHistories.userId, input.userId)).orderBy(desc(memberRestrictionHistories.appliedAt));
        }

        return histories;
      }),
    updateNickname: adminKeyProcedure
      .input(z.object({ userId: z.number(), name: z.string() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('DB unavailable');
        await db.update(users).set({ name: input.name }).where(eq(users.id, input.userId));
        return { success: true };
      }),
    checkNickname: adminKeyProcedure
      .input(z.object({ name: z.string(), excludeUserId: z.number().optional() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('DB unavailable');
        const existing = await db.select({ id: users.id }).from(users).where(eq(users.name, input.name)).limit(1);
        const isDuplicate = existing.length > 0 && existing[0].id !== input.excludeUserId;
        return { isDuplicate };
      }),
  }),

  // ===== GAMES =====
  games: router({
    list: adminKeyProcedure
      .input(z.object({ search: z.string().optional(), page: z.number().default(1), pageSize: z.number().default(20) }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return { items: [], total: 0 };
        const offset = (input.page - 1) * input.pageSize;
        let q = db.select().from(games).$dynamic();
        if (input.search) q = q.where(like(games.name, `%${input.search}%`));
        const items = await q.orderBy(asc(games.sortOrder), asc(games.id)).limit(input.pageSize).offset(offset);
        const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(games);
        return { items, total: Number(count) };
      }),
    create: adminKeyProcedure
      .input(z.object({ name: z.string(), description: z.string().optional(), imageUrl: z.string().optional(), genre: z.string().optional(), platform: z.string().optional(), status: z.enum(['active','beta','maintenance','inactive']).default('active'), sortOrder: z.number().optional() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('DB unavailable');
        // sortOrder가 없으면 현재 max+10으로 자동 부여
        let sortOrder = input.sortOrder;
        if (sortOrder === undefined || sortOrder === null) {
          const [{ maxOrder }] = await db.select({ maxOrder: sql<number>`COALESCE(MAX(sortOrder), 0)` }).from(games);
          sortOrder = Number(maxOrder) + 10;
        }
        const result = await db.insert(games).values({ ...input, sortOrder });
        return { id: (result as any).insertId };
      }),
    update: adminKeyProcedure
      .input(z.object({ id: z.number(), name: z.string().optional(), description: z.string().optional(), imageUrl: z.string().optional(), genre: z.string().optional(), platform: z.string().optional(), status: z.enum(['active','beta','maintenance','inactive']).optional(), sortOrder: z.number().optional() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('DB unavailable');
        const { id, ...rest } = input;
        await db.update(games).set(rest).where(eq(games.id, id));
        return { success: true };
      }),
    delete: adminKeyProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('DB unavailable');
        await db.delete(games).where(eq(games.id, input.id));
        return { success: true };
      }),
  }),

  // ===== COUPON GRANT/REVOKE =====
  couponGrant: router({
    grant: adminKeyProcedure
      .input(z.object({ couponId: z.number(), userId: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('DB unavailable');
        // 쿠폰 사용 처리
        await db.insert(couponUses).values({ couponId: input.couponId, userId: input.userId });
        await db.update(coupons).set({ usedCount: sql`${coupons.usedCount} + 1` }).where(eq(coupons.id, input.couponId));
        return { success: true };
      }),
    revoke: adminKeyProcedure
      .input(z.object({ couponUseId: z.number(), couponId: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('DB unavailable');
        await db.delete(couponUses).where(eq(couponUses.id, input.couponUseId));
        await db.update(coupons).set({ usedCount: sql`GREATEST(0, ${coupons.usedCount} - 1)` }).where(eq(coupons.id, input.couponId));
        return { success: true };
      }),
  }),

  // ===== PRODUCT GRANT/REVOKE =====
  productGrant: router({
    grant: adminKeyProcedure
      .input(z.object({ productId: z.number(), userId: z.number(), reason: z.string().optional() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('DB unavailable');
        // 상품 지급 = 포인트 지급으로 처리 (상품의 pointAmount 조회 후 지급)
        const [product] = await db.select().from(products).where(eq(products.id, input.productId)).limit(1);
        if (!product) throw new Error('상품을 찾을 수 없습니다.');
        await db.insert(pointLogs).values({ userId: input.userId, type: 'free', amount: product.pointAmount, reason: input.reason ?? `상품 지급: ${product.name}` });
        return { success: true, pointAmount: product.pointAmount };
      }),
  }),

  // ===== SHOP (rCoin) =====
  shop: router({
    // 공개: 활성 상품 목록
    listProducts: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(ruCashProducts).where(eq(ruCashProducts.isActive, 1)).orderBy(asc(ruCashProducts.sortOrder), asc(ruCashProducts.id));
    }),

    // 공개: 내 잔액 조회
    myBalance: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) return { ruCash: 0, bonusCash: 0 };
      const db = await getDb();
      if (!db) return { ruCash: 0, bonusCash: 0 };
      const [row] = await db.select().from(ruCashBalances).where(eq(ruCashBalances.userId, ctx.user.id)).limit(1);
      return row ? { ruCash: row.ruCash, bonusCash: row.bonusCash } : { ruCash: 0, bonusCash: 0 };
    }),

    // 공개: 내 충전 내역 (구매 내역)
    myChargeHistory: publicProcedure
      .input(z.object({ page: z.number().default(1), pageSize: z.number().default(20) }))
      .query(async ({ ctx, input }) => {
        if (!ctx.user) return { items: [], total: 0 };
        const db = await getDb();
        if (!db) return { items: [], total: 0 };
        const offset = (input.page - 1) * input.pageSize;
        const [items, countResult] = await Promise.all([
          db.select().from(ruCashTransactions)
            .where(sql`${ruCashTransactions.userId} = ${ctx.user.id} AND ${ruCashTransactions.type} = 'charge'`)
            .orderBy(desc(ruCashTransactions.createdAt))
            .limit(input.pageSize).offset(offset),
          db.select({ count: sql<number>`COUNT(*)` }).from(ruCashTransactions)
            .where(sql`${ruCashTransactions.userId} = ${ctx.user.id} AND ${ruCashTransactions.type} = 'charge'`),
        ]);
        return { items, total: Number(countResult[0]?.count ?? 0) };
      }),

    // 공개: 내 사용 내역
    myUseHistory: publicProcedure
      .input(z.object({ page: z.number().default(1), pageSize: z.number().default(20) }))
      .query(async ({ ctx, input }) => {
        if (!ctx.user) return { items: [], total: 0 };
        const db = await getDb();
        if (!db) return { items: [], total: 0 };
        const offset = (input.page - 1) * input.pageSize;
        const [items, countResult] = await Promise.all([
          db.select().from(ruCashTransactions)
            .where(sql`${ruCashTransactions.userId} = ${ctx.user.id} AND ${ruCashTransactions.type} = 'use'`)
            .orderBy(desc(ruCashTransactions.createdAt))
            .limit(input.pageSize).offset(offset),
          db.select({ count: sql<number>`COUNT(*)` }).from(ruCashTransactions)
            .where(sql`${ruCashTransactions.userId} = ${ctx.user.id} AND ${ruCashTransactions.type} = 'use'`),
        ]);
        return { items, total: Number(countResult[0]?.count ?? 0) };
      }),

    // 관리자: 상품 목록
    adminListProducts: adminKeyProcedure
      .input(z.object({ page: z.number().default(1), pageSize: z.number().default(50) }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('DB unavailable');
        const offset = (input.page - 1) * input.pageSize;
        const [items, countResult] = await Promise.all([
          db.select().from(ruCashProducts).orderBy(asc(ruCashProducts.sortOrder), asc(ruCashProducts.id)).limit(input.pageSize).offset(offset),
          db.select({ count: sql<number>`COUNT(*)` }).from(ruCashProducts),
        ]);
        return { items, total: Number(countResult[0]?.count ?? 0) };
      }),

    // 관리자: 상품 등록
    adminCreateProduct: adminKeyProcedure
      .input(z.object({ name: z.string(), priceUsd: z.string(), ruCashAmount: z.number(), bonusCashAmount: z.number(), imageUrl: z.string().optional(), isActive: z.number().default(1), sortOrder: z.number().default(0) }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('DB unavailable');
        await db.insert(ruCashProducts).values({ name: input.name, priceUsd: input.priceUsd, ruCashAmount: input.ruCashAmount, bonusCashAmount: input.bonusCashAmount, imageUrl: input.imageUrl ?? null, isActive: input.isActive, sortOrder: input.sortOrder });
        return { success: true };
      }),

    // 관리자: 상품 수정
    adminUpdateProduct: adminKeyProcedure
      .input(z.object({ id: z.number(), name: z.string(), priceUsd: z.string(), ruCashAmount: z.number(), bonusCashAmount: z.number(), imageUrl: z.string().optional(), isActive: z.number(), sortOrder: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('DB unavailable');
        await db.update(ruCashProducts).set({ name: input.name, priceUsd: input.priceUsd, ruCashAmount: input.ruCashAmount, bonusCashAmount: input.bonusCashAmount, imageUrl: input.imageUrl ?? null, isActive: input.isActive, sortOrder: input.sortOrder }).where(eq(ruCashProducts.id, input.id));
        return { success: true };
      }),

    // 관리자: 상품 삭제
    adminDeleteProduct: adminKeyProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('DB unavailable');
        await db.delete(ruCashProducts).where(eq(ruCashProducts.id, input.id));
        return { success: true };
      }),

    // 관리자: 충전 내역 목록
    adminChargeHistory: adminKeyProcedure
      .input(z.object({ page: z.number().default(1), pageSize: z.number().default(20), userId: z.number().optional() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('DB unavailable');
        const offset = (input.page - 1) * input.pageSize;
        const whereClause = input.userId
          ? sql`${ruCashTransactions.type} = 'charge' AND ${ruCashTransactions.userId} = ${input.userId}`
          : sql`${ruCashTransactions.type} = 'charge'`;
        const [items, countResult] = await Promise.all([
          db.select({ tx: ruCashTransactions, user: { id: users.id, name: users.name, openId: users.openId } })
            .from(ruCashTransactions)
            .leftJoin(users, eq(ruCashTransactions.userId, users.id))
            .where(whereClause)
            .orderBy(desc(ruCashTransactions.createdAt))
            .limit(input.pageSize).offset(offset),
          db.select({ count: sql<number>`COUNT(*)` }).from(ruCashTransactions).where(whereClause),
        ]);
        return { items, total: Number(countResult[0]?.count ?? 0) };
      }),

    // 관리자: 사용 내역 목록
    adminUseHistory: adminKeyProcedure
      .input(z.object({ page: z.number().default(1), pageSize: z.number().default(20), userId: z.number().optional() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('DB unavailable');
        const offset = (input.page - 1) * input.pageSize;
        const whereClause = input.userId
          ? sql`${ruCashTransactions.type} = 'use' AND ${ruCashTransactions.userId} = ${input.userId}`
          : sql`${ruCashTransactions.type} = 'use'`;
        const [items, countResult] = await Promise.all([
          db.select({ tx: ruCashTransactions, user: { id: users.id, name: users.name, openId: users.openId } })
            .from(ruCashTransactions)
            .leftJoin(users, eq(ruCashTransactions.userId, users.id))
            .where(whereClause)
            .orderBy(desc(ruCashTransactions.createdAt))
            .limit(input.pageSize).offset(offset),
          db.select({ count: sql<number>`COUNT(*)` }).from(ruCashTransactions).where(whereClause),
        ]);
        return { items, total: Number(countResult[0]?.count ?? 0) };
      }),

    // 관리자: 회원 잔액 목록
    adminBalances: adminKeyProcedure
      .input(z.object({ page: z.number().default(1), pageSize: z.number().default(20), search: z.string().optional() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('DB unavailable');
        const offset = (input.page - 1) * input.pageSize;
        const whereClause = input.search
          ? sql`(${users.name} LIKE ${'%' + (input.search ?? '') + '%'} OR ${users.openId} LIKE ${'%' + (input.search ?? '') + '%'})`
          : undefined;
        const [items, countResult] = await Promise.all([
          db.select({ balance: ruCashBalances, user: { id: users.id, name: users.name, openId: users.openId } })
            .from(ruCashBalances)
            .leftJoin(users, eq(ruCashBalances.userId, users.id))
            .where(whereClause)
            .orderBy(desc(ruCashBalances.updatedAt))
            .limit(input.pageSize).offset(offset),
          db.select({ count: sql<number>`COUNT(*)` }).from(ruCashBalances).where(whereClause),
        ]);
        return { items, total: Number(countResult[0]?.count ?? 0) };
      }),

    // 관리자: 잔액 수동 조정
    adminAdjustBalance: adminKeyProcedure
      .input(z.object({ userId: z.number(), ruCashDelta: z.number(), bonusCashDelta: z.number(), reason: z.string().optional() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('DB unavailable');
        const [existing] = await db.select().from(ruCashBalances).where(eq(ruCashBalances.userId, input.userId)).limit(1);
        const before = existing ?? { ruCash: 0, bonusCash: 0 };
        const afterRuCash = Math.max(0, before.ruCash + input.ruCashDelta);
        const afterBonusCash = Math.max(0, before.bonusCash + input.bonusCashDelta);
        if (existing) {
          await db.update(ruCashBalances).set({ ruCash: afterRuCash, bonusCash: afterBonusCash }).where(eq(ruCashBalances.userId, input.userId));
        } else {
          await db.insert(ruCashBalances).values({ userId: input.userId, ruCash: afterRuCash, bonusCash: afterBonusCash });
        }
        await db.insert(ruCashTransactions).values({
          userId: input.userId, type: input.ruCashDelta >= 0 ? 'charge' : 'use',
          beforeRuCash: before.ruCash, beforeBonusCash: before.bonusCash,
          ruCashDelta: Math.abs(input.ruCashDelta), bonusCashDelta: Math.abs(input.bonusCashDelta),
          afterRuCash, afterBonusCash,
          pgName: '관리자 수동 조정', itemName: input.reason ?? '관리자 조정',
        });
        return { success: true, afterRuCash, afterBonusCash };
      }),
  }),
});

export type AppRouter = typeof appRouter;
