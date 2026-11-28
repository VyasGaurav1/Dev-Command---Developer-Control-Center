import { sql } from "drizzle-orm"
import { boolean, check, index, pgTable, text, timestamp, unique, uniqueIndex } from "drizzle-orm/pg-core"

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt", { withTimezone: true }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt", { withTimezone: true }),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt", { withTimezone: true }),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt", { withTimezone: true }).notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
})

export const workspaces = pgTable(
  "workspaces",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    name: text("name").notNull(),
    kind: text("kind").$type<"personal" | "team">().notNull(),
    ownerUserId: text("ownerUserId").notNull(),
    createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check("workspaces_kind_check", sql`${table.kind} in ('personal', 'team')`),
    uniqueIndex("workspaces_personal_owner_uidx").on(table.ownerUserId).where(sql`${table.kind} = 'personal'`),
    index("workspaces_owner_created_idx").on(table.ownerUserId, table.createdAt.desc()),
  ],
)

export type WorkspaceRole = "owner" | "admin" | "developer" | "viewer"

export const workspaceMembers = pgTable(
  "workspace_members",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    workspaceId: text("workspaceId").notNull(),
    userId: text("userId").notNull(),
    role: text("role").$type<WorkspaceRole>().notNull(),
    createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check("workspace_members_role_check", sql`${table.role} in ('owner', 'admin', 'developer', 'viewer')`),
    unique("workspace_members_workspace_user_unique").on(table.workspaceId, table.userId),
    index("workspace_members_user_workspace_idx").on(table.userId, table.workspaceId),
  ],
)

export const projects = pgTable(
  "projects",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    workspaceId: text("workspaceId").notNull(),
    userId: text("userId").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    status: text("status").$type<"active" | "archived">().notNull().default("active"),
    createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("projects_user_created_idx").on(table.userId, table.createdAt.desc()),
    index("projects_workspace_updated_idx").on(table.workspaceId, table.updatedAt.desc()),
  ],
)

export type Project = typeof projects.$inferSelect
export type ProjectSummary = Pick<Project, "id" | "name" | "description" | "status" | "createdAt" | "updatedAt">
