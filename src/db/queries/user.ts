import {NewUser, users} from "../schema";
import {db} from "../index";

export async function createUser(user: NewUser) {
    const [result] = await db.insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning();
    return result;
}