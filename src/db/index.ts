import * as schema from "./schema.js"
import {API_CONFIG} from "../config.js"

import postgres from 'postgres'
import {drizzle} from "drizzle-orm/postgres-js"

const conn = postgres(API_CONFIG.dbURL)
export const db = drizzle(conn, {schema})