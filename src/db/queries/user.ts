import {NewUser, users} from "../schema.js";
import {db} from "../index.js";

export async function createUser(user: NewUser) {
    const [result] = await db.insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning();
    return result;
}

export async function clearUsers() {
    await db.delete(users);
}