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
import { type AdapterAccount } from "next-auth/adapters"

/* ******************** START - DEFAULT STUFF FROM NEXTAUTH ******************** */
export const accounts = mysqlTable(
  "accounts",
  {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
    type: varchar("type", { length: 191 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 191 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 191 }).notNull(),
    accessToken: text("access_token"),
    expiresIn: int("expires_in"),
    idToken: text("id_token"),
    refreshToken: text("refresh_token"),
    refreshTokenExpiresIn: int("refresh_token_expires_in"),
    scope: varchar("scope", { length: 191 }),
    tokenType: varchar("token_type", { length: 191 }),
    createdAt: timestamp("createdAt", { mode: "string" })
      .defaultNow()
      .onUpdateNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { mode: "string" })
      .defaultNow()
      .onUpdateNow()
      .notNull(),
  },
  (table) => {
    return {
      providerProviderAccountIdIdx: uniqueIndex(
        "accounts__provider__providerAccountId__idx",
      ).on(table.provider, table.providerAccountId),
      userIdIdx: index("accounts__userId__idx").on(table.userId),
    }
  },
)

export const sessions = mysqlTable(
  "sessions",
  {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    sessionToken: varchar("sessionToken", { length: 191 }).notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
    expires: datetime("expires", { mode: "date" }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .onUpdateNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .onUpdateNow()
      .notNull(),
  },
  (table) => {
    return {
      sessionTokenIdx: uniqueIndex("sessions__sessionToken__idx").on(
        table.sessionToken,
      ),
      userIdIdx: index("sessions__userId__idx").on(table.userId),
    }
  },
)

export const verificationTokens = mysqlTable(
  "verification_tokens",
  {
    identifier: varchar("identifier", { length: 191 }).primaryKey().notNull(),
    token: varchar("token", { length: 191 }).notNull(),
    expires: datetime("expires", { mode: "date" }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .onUpdateNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .onUpdateNow()
      .notNull(),
  },
  (table) => {
    return {
      tokenIdx: uniqueIndex("verification_tokens__token__idx").on(table.token),
    }
  },
)

export const users = mysqlTable(
  "users",
  {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    name: varchar("name", { length: 191 }),
    email: varchar("email", { length: 191 }).notNull(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: varchar("image", { length: 191 }),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .onUpdateNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .onUpdateNow()
      .notNull(),
    /* ********** START - CUSTOM USER COLUMNS ********** */
    hoard_id: int("hoard_id"),
    username: varchar("username", { length: 191 }),
    /* ********** END - CUSTOM USER COLUMNS ********** */
  },
  (table) => {
    return {
      emailIdx: uniqueIndex("users__email__idx").on(table.email),
    }
  },
)

/* ******************** END - DEFAULT STUFF FROM NEXTAUTH ******************** */

export const usersRelations = relations(users, ({ one }) => ({
  ship: one(ship, {
    fields: [users.id],
    references: [ship.userId],
  }),
  sessions: one(sessions, {
    fields: [users.id],
    references: [sessions.userId],
  }),
  accounts: one(accounts, {
    fields: [users.id],
    references: [accounts.userId],
  }),
}))

export const ship = mysqlTable("ship", {
  id: serial("id").primaryKey().notNull(),
  shipTypeId: smallint("ship_type_id").notNull(),
  userId: varchar("user_id", { length: 191 }).notNull(),
  cityId: int("city_id").notNull(),
  pathId: int("path_id"),
  cargo: json("cargo"),
})

export const path = mysqlTable("path", {
  id: serial("id").primaryKey().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  path: text("path"),
})

export const pathRelations = relations(path, ({ one }) => ({
  npc: one(npc, {
    fields: [path.id],
    references: [npc.pathId],
  }),
  ship: one(ship, {
    fields: [path.id],
    references: [ship.pathId],
  }),
}))

export const tile = mysqlTable("tile", {
  id: serial("id").primaryKey().notNull(),
  x: int("x").notNull(),
  y: int("y").notNull(),
})

export const tileRelations = relations(tile, ({ one }) => ({
  city: one(city, {
    fields: [tile.id],
    references: [city.tileId],
  }),
}))

export const city = mysqlTable("city", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 191 }).notNull(),
  tileId: int("tile_id").notNull(),
  level: json("level"),
})

export const cityRelations = relations(city, ({ one }) => ({
  ship: one(ship, {
    fields: [city.id],
    references: [ship.cityId],
  }),
}))

export const npc = mysqlTable("npc", {
  id: serial("id").primaryKey().notNull(),
  npcTypeId: int("npc_type_id").notNull(),
  pathId: int("path_id"),
})
