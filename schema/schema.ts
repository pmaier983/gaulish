import { relations } from "drizzle-orm"
import {
  datetime,
  index,
  int,
  mysqlTable,
  text,
  uniqueIndex,
  timestamp,
  varchar,
  serial,
  smallint,
  json,
} from "drizzle-orm/mysql-core"

// TODO: possibly rip out the refresh token?

/* ******************** START - DEFAULT STUFF FROM NEXTAUTH ******************** */
export const accounts = mysqlTable(
  "accounts",
  {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
    type: varchar("type", { length: 191 }).notNull(),
    provider: varchar("provider", { length: 191 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 191 }).notNull(),
    access_token: text("access_token"),
    expires_in: int("expires_in"),
    id_token: text("id_token"),
    refresh_token: text("refresh_token"),
    refresh_token_expires_in: int("refresh_token_expires_in"),
    scope: varchar("scope", { length: 191 }),
    token_type: varchar("token_type", { length: 191 }),
    createdAt: timestamp("createdAt").defaultNow().onUpdateNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (account) => ({
    providerProviderAccountIdIndex: uniqueIndex(
      "accounts__provider__providerAccountId__idx",
    ).on(account.provider, account.providerAccountId),
    userIdIndex: index("accounts__userId__idx").on(account.userId),
  }),
)

export const sessions = mysqlTable(
  "sessions",
  {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    sessionToken: varchar("sessionToken", { length: 191 }).notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
    expires: datetime("expires").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow().onUpdateNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  (session) => ({
    sessionTokenIndex: uniqueIndex("sessions__sessionToken__idx").on(
      session.sessionToken,
    ),
    userIdIndex: index("sessions__userId__idx").on(session.userId),
  }),
)

export const verificationTokens = mysqlTable(
  "verification_tokens",
  {
    identifier: varchar("identifier", { length: 191 }).primaryKey().notNull(),
    token: varchar("token", { length: 191 }).notNull(),
    expires: datetime("expires").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow().onUpdateNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  (verificationToken) => ({
    tokenIndex: uniqueIndex("verification_tokens__token__idx").on(
      verificationToken.token,
    ),
  }),
)

/* ******************** END - DEFAULT STUFF FROM NEXTAUTH ******************** */

export const users = mysqlTable(
  "users",
  {
    /* ********** START - DEFAULT DRIZZLE ITEMS DO NOT CHANGE ********** */
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    name: varchar("name", { length: 191 }),
    email: varchar("email", { length: 191 }).notNull(),
    emailVerified: timestamp("emailVerified"),
    image: varchar("image", { length: 191 }),
    created_at: timestamp("created_at").notNull().defaultNow().onUpdateNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
    /* ********** END - DEFAULT DRIZZLE ITEMS DO NOT CHANGE ********** */
    hoard_id: int("hoard_id"),
    username: varchar("username", { length: 191 }),
  },
  (user) => ({
    emailIndex: uniqueIndex("users__email__idx").on(user.email),
  }),
)

export const ship = mysqlTable("ship", {
  id: serial("ship_id").primaryKey().notNull(),
  ship_type_id: smallint("ship_type_id").notNull(),
  cargo: json("cargo"),
})

// TODO: continue work on relationships
// export const shipRelations = relations(users, ({ one }) => ({
// 	profileInfo: one(profileInfo, {
// 		fields: [user.id],
// 		references: [profileInfo.userId],
// 	}),
// }));

export const path = mysqlTable("path", {
  id: serial("path_id").primaryKey().notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  path: text("path"),
})

export const tile = mysqlTable("tile", {
  id: serial("tile_id").primaryKey().notNull(),
  x: int("x").notNull(),
  y: int("y").notNull(),
})

export const city = mysqlTable("city", {
  id: serial("city_id").primaryKey().notNull(),
  name: varchar("name", { length: 191 }).notNull(),
  level: json("level"),
})

export const npc = mysqlTable("npc", {
  id: serial("npc_id").primaryKey().notNull(),
  npc_type_id: int("npc_type_id").notNull(),
})
