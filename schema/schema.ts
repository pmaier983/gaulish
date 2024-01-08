import { type InferSelectModel, relations } from "drizzle-orm"
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
  json,
  boolean,
} from "drizzle-orm/mysql-core"
import { type AdapterAccount } from "next-auth/adapters"
import {
  FAKE_INITIAL_SHIP_PATH_ID,
  type ShipType,
  type TileType,
} from "../src/components/constants"

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
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
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
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
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
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
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
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .onUpdateNow(),
    /* ********** START - CUSTOM USER COLUMNS ********** */
    username: varchar("username", { length: 191 }).default("Sailor").notNull(),
    knownTiles: json("known_tiles").$type<string[]>().default([]).notNull(),
    /* ********** END - CUSTOM USER COLUMNS ********** */
  },
  (table) => {
    return {
      emailIdx: uniqueIndex("users_email_idx").on(table.email),
    }
  },
)
export type User = InferSelectModel<typeof users>

/* ******************** END - DEFAULT STUFF FROM NEXTAUTH ******************** */

// TODO: unify a bunch of these columns so there is less duplicate code
export const usersRelations = relations(users, ({ one, many }) => ({
  ship: many(ship),
  sessions: one(sessions, {
    fields: [users.id],
    references: [sessions.userId],
  }),
  accounts: one(accounts, {
    fields: [users.id],
    references: [accounts.userId],
  }),
  log: many(log),
}))

export const ship = mysqlTable("ship", {
  id: varchar("id", { length: 191 }).primaryKey().notNull(),
  userId: varchar("user_id", { length: 191 }).notNull(),
  cityId: int("city_id").notNull(),
  pathId: varchar("path_id", { length: 191 })
    .notNull()
    .default(FAKE_INITIAL_SHIP_PATH_ID),
  cargoId: varchar("cargo_id", { length: 191 }).notNull(),
  shipType: varchar("ship_type", { length: 191 }).$type<ShipType>().notNull(),
  name: varchar("name", { length: 191 }).notNull(),
  speed: float("speed").notNull(),
  cargoCapacity: int("cargo_capacity").notNull(),
  isSunk: boolean("is_sunk").default(false).notNull(),
})
export type Ship = InferSelectModel<typeof ship>
export const shipRelations = relations(ship, ({ one, many }) => ({
  user: one(users, {
    fields: [ship.userId],
    references: [users.id],
  }),
  path: one(path, {
    fields: [ship.pathId],
    references: [path.id],
  }),
  city: one(city, {
    fields: [ship.cityId],
    references: [city.id],
  }),
  cargo: one(cargo, {
    fields: [ship.cargoId],
    references: [cargo.id],
  }),
  log: many(log),
}))

export const path = mysqlTable("path", {
  id: varchar("id", { length: 191 }).primaryKey().notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  pathArray: json("path_array").$type<string[]>().notNull(),
})
export type Path = InferSelectModel<typeof path>
export const pathRelations = relations(path, ({ one }) => ({
  // TODO: consider the benefits || negatives of merging these two tables
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
    type: varchar("ship_type", { length: 191 }).$type<TileType>().notNull(),
  },
  (tile) => ({
    xyIndex: uniqueIndex("xy_index").on(tile.x, tile.y),
  }),
)
export type Tile = InferSelectModel<typeof tile>
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
  cityCargo: json("city_cargo").$type<CityCargo[]>().notNull().default([]),
})
export type City = InferSelectModel<typeof city>
export const cityRelations = relations(city, ({ one, many }) => ({
  ship: many(ship),
  tile: one(tile, {
    fields: [city.xyTileId],
    references: [tile.xyTileId],
  }),
}))

export const npc = mysqlTable("npc", {
  id: serial("id").primaryKey().notNull(),
  pathId: varchar("path_id", { length: 191 }),
  shipType: varchar("ship_type", { length: 191 }).$type<ShipType>().notNull(),
  name: varchar("name", { length: 191 }).notNull(),
  speed: float("speed").notNull(),
})
export type Npc = InferSelectModel<typeof npc>
export const npcRelations = relations(npc, ({ one }) => ({
  path: one(path, {
    fields: [npc.pathId],
    references: [path.id],
  }),
}))

export const log = mysqlTable("log", {
  id: varchar("id", { length: 191 }).primaryKey().notNull(),
  userId: varchar("user_id", { length: 191 }).notNull(),
  shipId: varchar("ship_id", { length: 191 }).notNull(),
  text: text("text").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
})
export type Log = InferSelectModel<typeof log>
export const logRelations = relations(log, ({ one }) => ({
  user: one(users, {
    fields: [log.userId],
    references: [users.id],
  }),
  ship: one(ship, {
    fields: [log.shipId],
    references: [ship.id],
  }),
}))

export const cargo = mysqlTable("cargo", {
  id: varchar("id", { length: 191 }).primaryKey().notNull(),
  gold: int("gold").default(0).notNull(),
  /** ITTT: Also Update CARGO_TYPES_LIST */
  WHEAT: int("wheat").default(0).notNull(),
  WOOL: int("wool").default(0).notNull(),
  STONE: int("stone").default(0).notNull(),
  WOOD: int("wood").default(0).notNull(),
  /** ITTT: Also Update CARGO_TYPES_LIST */
})
export type Cargo = InferSelectModel<typeof cargo>
export const cargoRelations = relations(cargo, ({ one }) => ({
  ship: one(ship, {
    fields: [cargo.id],
    references: [ship.cargoId],
  }),
}))

export type CargoTypes = Uppercase<Exclude<keyof Cargo, "id" | "gold">>

// TODO: find a better way to keep this in sync with CargoTypes?
export const CARGO_TYPES_LIST = [
  "WHEAT",
  "STONE",
  "WOOD",
  "WOOL",
] as const satisfies CargoTypes[]

export type CityCargo = {
  type: CargoTypes
  amplitude: number
  midline: number
  isSelling: boolean
}
