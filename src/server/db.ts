import { drizzle } from "drizzle-orm/planetscale-serverless"
import * as schema from "schema"

import { connect } from "@planetscale/database"

// create the connection
const connection = connect({
  url: process.env.DATABASE_URL,
})

export const db = drizzle(connection, { schema })

export type DatabaseType = typeof db
