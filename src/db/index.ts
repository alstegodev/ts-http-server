import * as schema from "./schema.js"
import {DB_CONFIG} from "./config.js";

import postgres from 'postgres'
import {drizzle} from "drizzle-orm/postgres-js"
import {migrate} from "drizzle-orm/postgres-js/migrator"

const migrationClient = postgres(DB_CONFIG.url, {max: 1})
await migrate(drizzle(migrationClient), DB_CONFIG.migrationConfig)

const conn = postgres(DB_CONFIG.url)
export const db = drizzle(conn, {schema})