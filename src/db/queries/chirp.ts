import {chirps, NewChirp} from "../schema.js";
import {db} from "../index.js";
import {eq} from "drizzle-orm";

export async function createChirp(chirp: NewChirp) {
    const [result] = await db.insert(chirps)
        .values(chirp)
        .onConflictDoNothing()
        .returning();
    return result;
}

export async function getChirps() {
    return db.select()
        .from(chirps)
        .orderBy(chirps.createdAt);
}

export async function getSingleChirp(id: string) {
    const [result] = await db.select()
        .from(chirps)
        .where(eq(chirps.id, id))
    return result
}