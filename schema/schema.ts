import { type InferModel, relations } from "drizzle-orm"
import {
  datetime,
  index,
  int,
  float,
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
    userId: varchar("user_id", { length: 191 }).notNull(),
    type: varchar("type", { length: 191 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 191 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 191,
    }).notNull(),
    accessToken: text("access_token"),
    expiresIn: int("expires_in"),
    idToken: text("id_token"),
    refreshToken: text("refresh_token"),
    refreshTokenExpiresIn: int("refresh_token_expires_in"),
    scope: varchar("scope", { length: 191 }),
    tokenType: varchar("token_type", { length: 191 }),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .onUpdateNow(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .onUpdateNow(),
  },
  (table) => {
    return {
      providerProviderAccountIdIdx: uniqueIndex(
        "accounts_provider_providerAccountId_idx",
      ).on(table.provider, table.providerAccountId),
      userIdIdx: index("accounts_userId_idx").on(table.userId),
    }
  },
)

export const sessions = mysqlTable(
  "sessions",
  {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    sessionToken: varchar("session_token", { length: 191 }).notNull(),
    userId: varchar("user_id", { length: 191 }).notNull(),
    expires: datetime("expires", { mode: "date" }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .onUpdateNow(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .onUpdateNow(),
  },
  (table) => {
    return {
      sessionTokenIdx: uniqueIndex("sessions_sessionToken_idx").on(
        table.sessionToken,
      ),
      userIdIdx: index("sessions_userId_idx").on(table.userId),
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
      .onUpdateNow(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .onUpdateNow(),
  },
  (table) => {
    return {
      tokenIdx: uniqueIndex("verification_tokens_token_idx").on(table.token),
    }
  },
)

export const users = mysqlTable(
  "users",
  {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    name: varchar("name", { length: 191 }),
    email: varchar("email", { length: 191 }).notNull(),
    emailVerified: timestamp("email_verified", { mode: "date" }),
    image: varchar("image", { length: 191 }),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .onUpdateNow(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .onUpdateNow(),
    /* ********** START - CUSTOM USER COLUMNS ********** */
    username: varchar("username", { length: 191 }).default("Sailor").notNull(),
    /* ********** END - CUSTOM USER COLUMNS ********** */
  },
  (table) => {
    return {
      emailIdx: uniqueIndex("users_email_idx").on(table.email),
    }
  },
)
export type User = InferModel<typeof users>

/* ******************** END - DEFAULT STUFF FROM NEXTAUTH ******************** */

// TODO: unify a bunch of these columns so there is less duplicate code
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
  log: one(log, {
    fields: [users.id],
    references: [log.userId],
  }),
}))

export const ship = mysqlTable("ship", {
  id: varchar("id", { length: 191 }).primaryKey().notNull(),
  userId: varchar("user_id", { length: 191 }).notNull(),
  cityId: int("city_id").notNull(),
  pathId: varchar("path_id", { length: 191 }),
  // Ship's Cargo - consider moving this to a separate table?
  gold: int("gold").default(0).notNull(),
  wheat: int("wheat").default(0).notNull(),
  wool: int("wool").default(0).notNull(),
  stone: int("stone").default(0).notNull(),
  wood: int("wood").default(0).notNull(), // possibly add fine-wood & hardwood later
  shipType: varchar("ship_type", { length: 191 }).notNull(),
  name: varchar("name", { length: 191 }).notNull(),
  speed: float("speed").notNull(),
  cargoCapacity: int("cargo_capacity").notNull(),
})
export type Ship = InferModel<typeof ship>

export const path = mysqlTable("path", {
  id: varchar("id", { length: 191 }).primaryKey().notNull(),
  createdAt: timestamp("created_at", { mode: "date" })
    .defaultNow()
    .onUpdateNow(),
  pathArray: json("path_array").$type<string[]>().notNull(),
})
export type Path = InferModel<typeof path>

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

export const tile = mysqlTable(
  "tile",
  {
    // TODO: figure out how not to do this?
    /* This is a manually created composite key of x & y */
    xyTileId: varchar("xy_tile_id", { length: 191 }).primaryKey().notNull(),
    x: int("x").notNull(),
    y: int("y").notNull(),
    type_id: smallint("type_id").notNull(),
  },
  (tile) => ({
    xyIndex: uniqueIndex("xy_index").on(tile.x, tile.y),
  }),
)
export type Tile = InferModel<typeof tile>

export const tileRelations = relations(tile, ({ one }) => ({
  city: one(city, {
    fields: [tile.xyTileId],
    references: [city.xyTileId],
  }),
}))

export const city = mysqlTable("city", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 191 }).notNull(),
  xyTileId: varchar("xy_tile_id", { length: 191 }).notNull(),
  level: json("level"),
})
export type City = InferModel<typeof city>

export const cityRelations = relations(city, ({ one }) => ({
  ship: one(ship, {
    fields: [city.id],
    references: [ship.cityId],
  }),
}))

export const npc = mysqlTable("npc", {
  id: serial("id").primaryKey().notNull(),
  pathId: varchar("path_id", { length: 191 }),
  shipType: varchar("ship_type", { length: 191 }).notNull(),
  name: varchar("name", { length: 191 }).notNull(),
  speed: float("speed").notNull(),
  cargoCapacity: int("cargo_capacity").notNull(),
})
export type Npc = InferModel<typeof npc>

export const log = mysqlTable("log", {
  id: serial("id").primaryKey().notNull(),
  userId: varchar("user_id", { length: 191 }).notNull(),
  text: text("text").notNull(),
})
export type Log = InferModel<typeof log>
