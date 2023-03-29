import { int, mysqlTable, serial, text, varchar } from "drizzle-orm/mysql-core"

export const account = mysqlTable("Account", {
  id: serial("id").primaryKey(),
  userId: varchar("userId", { length: 191 }),
  type: varchar("type", { length: 191 }),
  provider: varchar("provider", { length: 191 }),
  providerAccountId: varchar("providerAccountId", { length: 191 }),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: int("expires_at"),
  token_type: varchar("token_type", { length: 191 }),
  scope: varchar("scope", { length: 191 }),
  id_token: text("id_token"),
  session_state: varchar("session_state", { length: 191 }),
})

// model Example {
//   id        String   @id @default(cuid())
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
// }

// model Account {
// id                 String  @id @default(cuid())
// userId             String
// type               String
// provider           String
// providerAccountId  String
// refresh_token      String?  @db.Text
// access_token       String?  @db.Text
// expires_at         Int?
// token_type         String?
// scope              String?
// id_token           String?  @db.Text
// session_state      String?

// user User @relation(fields: [userId], references: [id], onDelete: Cascade)

// @@unique([provider, providerAccountId])
// @@index([userId])
// }

// model Session {
// id           String   @id @default(cuid())
// sessionToken String   @unique
// userId       String
// expires      DateTime
// user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

// @@index([userId])
// }

// model User {
// id            String    @id @default(cuid())
// name          String?
// email         String?   @unique
// emailVerified DateTime?
// image         String?   @db.Text
// accounts      Account[]
// sessions      Session[]
// }

// model VerificationToken {
// identifier String
// token      String   @unique
// expires    DateTime

// @@unique([identifier, token])
// }
