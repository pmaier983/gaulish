import {
  datetime,
  index,
  int,
  mysqlTable,
  text,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core"

// TODO: rip out all of these table and add non prisma dependent ones in

export const account = mysqlTable(
  "Account",
  {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
    type: varchar("type", { length: 191 }).notNull(),
    provider: varchar("provider", { length: 191 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 191 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 191 }),
    scope: varchar("scope", { length: 191 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 191 }),
  },
  (account) => ({
    Account_provider_providerAccountId_key: uniqueIndex(
      "Account_provider_providerAccountId_key",
    ).on(account.provider, account.providerAccountId),
    Account_userId_idx: index("Account_userId_idx").on(account.userId),
  }),
)

// TODO: separate out sql table schema's?
export const example = mysqlTable("Example", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .notNull()
    .default(new Date().getTime().toString()),
  createdAt: datetime("createdAt").notNull(),
  updatedAt: datetime("updatedAt").notNull(),
})

export const session = mysqlTable(
  "Session",
  {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    sessionToken: varchar("sessionToken", { length: 191 }).notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
    expires: datetime("expires").notNull(),
  },
  (session) => ({
    Session_sessionToken_key: uniqueIndex("Session_sessionToken_key").on(
      session.sessionToken,
    ),
    Session_userId_idx: index("Session_userId_idx").on(session.userId),
  }),
)

export const user = mysqlTable(
  "User",
  {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    name: varchar("name", { length: 191 }),
    email: varchar("email", { length: 191 }),
    emailVerified: datetime("emailVerified"),
    image: text("image"),
  },
  (user) => ({
    User_email_key: uniqueIndex("User_email_key").on(user.email),
  }),
)

export const verificationToken = mysqlTable(
  "VerificationToken",
  {
    identifier: varchar("identifier", { length: 191 }).notNull(),
    token: varchar("token", { length: 191 }).notNull(),
    expires: datetime("expires").notNull(),
  },
  (verificationToken) => ({
    VerificationToken_token_key: uniqueIndex("VerificationToken_token_key").on(
      verificationToken.token,
    ),
    VerificationToken_identifier_token_key: uniqueIndex(
      "VerificationToken_identifier_token_key",
    ).on(verificationToken.identifier, verificationToken.token),
  }),
)
