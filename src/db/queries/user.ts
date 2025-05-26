import {NewUser, users} from "../schema.js";
import {db} from "../index.js";
import {eq} from "drizzle-orm";

export async function createUser(user: NewUser): Promise<UserResponse> {
    const [result] = await db.insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning();
    return {
        id: result.id,
        email: result.email,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
    };
}

export async function getUser(email: string) {
    const [result] = await db.select()
        .from(users)
        .where(eq(users.email, email))
    return result;
}

export async function clearUsers() {
    await db.delete(users);
}

export type UserResponse = Omit<NewUser, "hashedPassword">