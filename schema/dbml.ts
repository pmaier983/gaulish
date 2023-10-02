import * as schema from "./schema"
import { mysqlGenerate } from "drizzle-dbml-generator" // Using Postgres for this example

const out = "./schema/schema.dbml"
const relational = true

mysqlGenerate({ schema, out, relational })
