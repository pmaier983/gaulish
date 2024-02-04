import * as dotenv from "dotenv"
import type { Config } from "drizzle-kit"

dotenv.config()

// eslint-disable-next-line import/no-default-export
export default {
  schema: "./schema/schema.ts",
  driver: "mysql2",
  out: "./migrations-folder",
  dbCredentials: {
    uri: process.env.DATABASE_URL ?? "",
  },
  tablesFilter: ["gaulish_*"],
} satisfies Config
