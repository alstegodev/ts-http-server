import * as process from "node:process";

process.loadEnvFile()

type APIConfig = {
    fileserverHits: number;
    dbURL: string;
}

export const API_CONFIG: APIConfig = {
    fileserverHits: 0,
    dbURL: envOrThrow("DB_URL"),
}

function envOrThrow(key: string) {
    if(process.env[key] === undefined) {
        throw new Error(`Missing env var ${key}`)
    } else {
        return process.env[key]
    }
}