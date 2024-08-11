import { Database } from "@adonisjs/lucid/database";
import vine from "@vinejs/vine";

export const creationUserValidate = vine.compile(vine.object({
    name: vine.string().trim().minLength(3),
    login: vine.string().trim().minLength(4).unique(async (db: Database, value: string, _) => {
        return !(await db.query().from('users').select('id').where('login', value).first());
    }),
    password: vine.string().trim().minLength(6),
}));