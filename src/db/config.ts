import {MigrationConfig} from "drizzle-orm/migrator";

process.loadEnvFile()

type DBConfig = {
    migrationConfig: MigrationConfig;
    url: string;
}

const migrationConfig: MigrationConfig = {
    migrationsFolder: "./src/db/migrations"
}

export const DB_CONFIG: DBConfig = {
    migrationConfig: migrationConfig,
    url: envOrThrow("DB_URL"),
}

function envOrThrow(key: string) {
    if(process.env[key] === undefined) {
        throw new Error(`Missing env var ${key}`)
    } else {
        return process.env[key]
    }
}