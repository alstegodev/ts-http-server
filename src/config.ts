
process.loadEnvFile()

type APIConfig = {
    fileserverHits: number;
    platform: string;
}

export const API_CONFIG: APIConfig = {
    fileserverHits: 0,
    platform: envOrThrow("PLATFORM"),
}

function envOrThrow(key: string) {
    if(process.env[key] === undefined) {
        throw new Error(`Missing env var ${key}`)
    } else {
        return process.env[key]
    }
}