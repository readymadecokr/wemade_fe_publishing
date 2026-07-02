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
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  withdrawnAt: timestamp("withdrawnAt"),
});
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

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
export const statsEvents = mysqlTable("statsEvents", {
  id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
  eventType: varchar("eventType", { length: 64 }).notNull(), // signup, login, logout, withdraw, game_start, page_visit, purchase, refund
  userId: int("userId"),
  metadata: text("metadata"), // JSON
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
