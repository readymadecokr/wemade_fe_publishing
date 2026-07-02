import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminKeyProcedure, publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { users, banners, news, media, products, payments, pointLogs, coupons, couponUses, admins, statsEvents, games } from "../drizzle/schema";
import { storagePut } from "./storage";
import { asc, desc, eq, like, or, sql } from "drizzle-orm";
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
        })
      )
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const { page, pageSize, search, sortBy, sortOrder, roleFilter } = input;
        const offset = (page - 1) * pageSize;

        const whereConditions: unknown[] = [];

        if (search && search.trim()) {
          const searchTerm = `%${search.trim()}%`;
          whereConditions.push(
            or(
              like(users.name, searchTerm),
              like(users.email, searchTerm),
              like(users.openId, searchTerm)
            )
          );
        }

        if (roleFilter !== "all") {
          whereConditions.push(eq(users.role, roleFilter));
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
        const items = await q.orderBy(desc(news.createdAt)).limit(input.pageSize).offset(offset);
        const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(news);
        return { items, total: Number(count) };
      }),
    create: adminKeyProcedure
      .input(z.object({ title: z.string(), category: z.string().default('Update'), summary: z.string().optional(), content: z.string().optional(), imageUrl: z.string().optional(), isActive: z.number().default(1), publishedAt: z.string().optional() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('DB unavailable');
        const result = await db.insert(news).values({ ...input, publishedAt: input.publishedAt ? new Date(input.publishedAt) : new Date() });
        return { id: (result as any).insertId };
      }),
    update: adminKeyProcedure
      .input(z.object({ id: z.number(), title: z.string().optional(), category: z.string().optional(), summary: z.string().optional(), content: z.string().optional(), imageUrl: z.string().optional(), isActive: z.number().optional(), publishedAt: z.string().optional() }))
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
      .input(z.object({ userId: z.number(), status: z.enum(['active', 'suspended', 'banned']), suspendedUntil: z.string().optional(), reason: z.string().optional() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('DB unavailable');
        await db.update(users).set({ status: input.status, suspendedUntil: input.suspendedUntil ? new Date(input.suspendedUntil) : null, suspendReason: input.reason ?? null }).where(eq(users.id, input.userId));
        return { success: true };
      }),
    updateNickname: adminKeyProcedure
      .input(z.object({ userId: z.number(), name: z.string() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('DB unavailable');
        await db.update(users).set({ name: input.name }).where(eq(users.id, input.userId));
        return { success: true };
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
      .input(z.object({ name: z.string(), description: z.string().optional(), imageUrl: z.string().optional(), genre: z.string().optional(), platform: z.string().optional(), status: z.enum(['active','beta','maintenance','inactive']).default('active'), sortOrder: z.number().default(0) }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('DB unavailable');
        const result = await db.insert(games).values(input);
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
});

export type AppRouter = typeof appRouter;
