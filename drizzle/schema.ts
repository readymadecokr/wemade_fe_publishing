import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, bigint } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  status: mysqlEnum("status", ["active", "suspended", "banned"]).default("active").notNull(),
  suspendedUntil: timestamp("suspendedUntil"),
  suspendReason: text("suspendReason"),
  csCode: varchar("csCode", { length: 32 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  withdrawnAt: timestamp("withdrawnAt"),
});
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const memberRestrictionHistories = mysqlTable("memberRestrictionHistories", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  status: mysqlEnum("status", ["active", "suspended", "banned"]).notNull(),
  csCode: varchar("csCode", { length: 32 }),
  reason: text("reason"),
  suspendedUntil: timestamp("suspendedUntil"),
  appliedAt: timestamp("appliedAt").defaultNow().notNull(),
});
export type MemberRestrictionHistory = typeof memberRestrictionHistories.$inferSelect;
export type InsertMemberRestrictionHistory = typeof memberRestrictionHistories.$inferInsert;

export const files = mysqlTable("files", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  filename: varchar("filename", { length: 255 }).notNull(),
  fileKey: varchar("fileKey", { length: 512 }).notNull(),
  fileUrl: text("fileUrl").notNull(),
  mimeType: varchar("mimeType", { length: 100 }),
  fileSize: int("fileSize"),
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type File = typeof files.$inferSelect;
export type InsertFile = typeof files.$inferInsert;

export const banners = mysqlTable("banners", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  imageUrl: text("imageUrl").notNull(),
  imageKey: varchar("imageKey", { length: 512 }),
  actionType: mysqlEnum("actionType", ["url", "content"]).default("url").notNull(),
  actionUrl: text("actionUrl"),
  contentTitle: varchar("contentTitle", { length: 255 }),
  contentDate: varchar("contentDate", { length: 50 }),
  contentBody: text("contentBody"),
  sortOrder: int("sortOrder").default(0).notNull(),
  isActive: int("isActive").default(1).notNull(),
  startDate: varchar("startDate", { length: 20 }),
  endDate: varchar("endDate", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Banner = typeof banners.$inferSelect;
export type InsertBanner = typeof banners.$inferInsert;

/** News / Card News */
export const news = mysqlTable("news", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 64 }).default("Update").notNull(),
  summary: text("summary"),
  content: text("content"),
  imageUrl: text("imageUrl"),
  isActive: int("isActive").default(1).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  publishedAt: timestamp("publishedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type News = typeof news.$inferSelect;
export type InsertNews = typeof news.$inferInsert;

/** Media (YouTube links) */
export const media = mysqlTable("media", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  youtubeUrl: varchar("youtubeUrl", { length: 512 }).notNull(),
  description: text("description"),
  sortOrder: int("sortOrder").default(0).notNull(),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Media = typeof media.$inferSelect;
export type InsertMedia = typeof media.$inferInsert;

/** In-App Products */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("USD").notNull(),
  pointAmount: int("pointAmount").default(0).notNull(),
  imageUrl: text("imageUrl"),
  isActive: int("isActive").default(1).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/** Points (user point balance log) */
export const pointLogs = mysqlTable("pointLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: mysqlEnum("type", ["paid", "free"]).default("free").notNull(),
  amount: int("amount").notNull(), // positive=지급, negative=차감
  reason: varchar("reason", { length: 255 }),
  adminId: int("adminId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type PointLog = typeof pointLogs.$inferSelect;

/** Payment records */
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  productId: int("productId").references(() => products.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("USD").notNull(),
  status: mysqlEnum("status", ["pending", "completed", "refunded", "failed"]).default("pending").notNull(),
  receiptUrl: text("receiptUrl"),
  refundReason: text("refundReason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Payment = typeof payments.$inferSelect;

/** Coupons */
export const coupons = mysqlTable("coupons", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  benefitType: mysqlEnum("benefitType", ["point", "product"]).default("point").notNull(),
  benefitValue: int("benefitValue").default(0).notNull(), // points or productId
  maxUses: int("maxUses").default(1).notNull(),
  usedCount: int("usedCount").default(0).notNull(),
  expiresAt: timestamp("expiresAt"),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Coupon = typeof coupons.$inferSelect;

/** Coupon usage log */
export const couponUses = mysqlTable("couponUses", {
  id: int("id").autoincrement().primaryKey(),
  couponId: int("couponId").notNull().references(() => coupons.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  usedAt: timestamp("usedAt").defaultNow().notNull(),
});

/** Admin accounts (separate from Manus OAuth users) */
export const admins = mysqlTable("admins", {
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 64 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  displayName: varchar("displayName", { length: 128 }),
  permissions: text("permissions"), // JSON array of allowed menus
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastLoginAt: timestamp("lastLoginAt"),
});
export type Admin = typeof admins.$inferSelect;

/** Games table */
export const games = mysqlTable("games", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: text("imageUrl"),
  genre: varchar("genre", { length: 128 }),
  platform: varchar("platform", { length: 128 }),
  status: mysqlEnum("status", ["active", "beta", "maintenance", "inactive"]).default("active").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Game = typeof games.$inferSelect;

/** Statistics event log */
/** RU Cash 충전 상품 */
export const ruCashProducts = mysqlTable("ruCashProducts", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  priceUsd: decimal("priceUsd", { precision: 10, scale: 2 }).notNull(), // USD 가격
  ruCashAmount: int("ruCashAmount").default(0).notNull(),               // 지급 RU Cash
  bonusCashAmount: int("bonusCashAmount").default(0).notNull(),         // 지급 Bonus RU Cash
  imageUrl: text("imageUrl"),
  isActive: int("isActive").default(1).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type RuCashProduct = typeof ruCashProducts.$inferSelect;

/** RU Cash 잔액 (사용자별 단일 행) */
export const ruCashBalances = mysqlTable("ruCashBalances", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  ruCash: int("ruCash").default(0).notNull(),
  bonusCash: int("bonusCash").default(0).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type RuCashBalance = typeof ruCashBalances.$inferSelect;

/** RU Cash 트랜잭션 (충전/차감 이력) */
export const ruCashTransactions = mysqlTable("ruCashTransactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: mysqlEnum("type", ["charge", "use"]).notNull(),                // charge=충전, use=사용
  gameCode: varchar("gameCode", { length: 32 }).default("ROU").notNull(),
  // 충전 전 잔액
  beforeRuCash: int("beforeRuCash").default(0).notNull(),
  beforeBonusCash: int("beforeBonusCash").default(0).notNull(),
  // 변동량 (충전 시 양수, 차감 시 양수 = 차감된 양)
  ruCashDelta: int("ruCashDelta").default(0).notNull(),
  bonusCashDelta: int("bonusCashDelta").default(0).notNull(),
  // 충전 후 잔액
  afterRuCash: int("afterRuCash").default(0).notNull(),
  afterBonusCash: int("afterBonusCash").default(0).notNull(),
  // 충전 전용 필드
  productId: int("productId").references(() => ruCashProducts.id),
  pgName: varchar("pgName", { length: 64 }),                           // PayPal, PayerMax 등
  priceUsd: decimal("priceUsd", { precision: 10, scale: 2 }),
  // 사용 전용 필드
  itemName: varchar("itemName", { length: 255 }),
  itemQty: int("itemQty").default(1),
  itemPriceRuc: int("itemPriceRuc").default(0),                        // 아이템 단가(RUC)
  totalPriceRuc: int("totalPriceRuc").default(0),                      // 총 차감(RUC)
  transactionId: varchar("transactionId", { length: 128 }),            // 멱등 키
  status: mysqlEnum("status", ["completed", "failed", "pending"]).default("completed").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type RuCashTransaction = typeof ruCashTransactions.$inferSelect;

/** Statistics event log */
export const statsEvents = mysqlTable("statsEvents", {
  id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
  eventType: varchar("eventType", { length: 64 }).notNull(), // signup, login, logout, withdraw, game_start, page_visit, purchase, refund
  userId: int("userId"),
  metadata: text("metadata"), // JSON
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
