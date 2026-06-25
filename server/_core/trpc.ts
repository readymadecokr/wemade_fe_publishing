import { NOT_ADMIN_ERR_MSG, UNAUTHED_ERR_MSG } from '@shared/const';
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const requireUser = t.middleware(async opts => {
  const { ctx, next } = opts;

  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(requireUser);

export const adminProcedure = t.procedure.use(
  t.middleware(async opts => {
    const { ctx, next } = opts;

    if (!ctx.user || ctx.user.role !== 'admin') {
      throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  }),
);

// ID/PW 기반 관리자 인증 — x-admin-key 헤더로 인증
const ADMIN_ACCOUNTS: Record<string, string> = {
  cyanima: "0000",
  blue0246: "0000",
};

export const adminKeyProcedure = t.procedure.use(
  t.middleware(async opts => {
    const { ctx, next } = opts;
    const adminKey = (ctx.req as { headers?: Record<string, string> }).headers?.["x-admin-key"] ?? "";
    // adminKey 형식: "id:pw"
    const [id, pw] = adminKey.split(":");
    const validPw = ADMIN_ACCOUNTS[id];
    if (!validPw || pw !== validPw) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Invalid admin credentials" });
    }
    return next({ ctx });
  }),
);
