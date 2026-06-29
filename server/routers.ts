import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminKeyProcedure, publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { users } from "../drizzle/schema";
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
});

export type AppRouter = typeof appRouter;
