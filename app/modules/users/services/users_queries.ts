import User from "#models/user";
import db from "@adonisjs/lucid/services/db";
import { UserCretionData, UserLoginData, ResultLoginUserData, UserForClient, TokenForClient } from "../types/user_types.js";


export default class UsersQueriesService {
    static async loginUser(data: UserLoginData): Promise<ResultLoginUserData | null> {
        return new Promise((resolve, reject) => {
            db.transaction(async (trx) => {
                try {
                    const user: User | null = await User.query({client: trx}).select('*').where('login', data.login).first();
                    if(user) {
                        const accessToken: TokenForClient = (await User.accessTokens.create(user)).toJSON() as any;
                        const readyUser: UserForClient = user.toJSON() as any;
                        Reflect.deleteProperty(readyUser, 'password');
                        resolve({ user: readyUser, token: accessToken});
                    } else {
                        resolve(null);
                    }
                    await trx.commit();
                } catch (err) {
                    await trx.rollback();
                    console.error('modules/users/services/users_queries.ts: [UsersQueriesService]:loginUser => ', err);
                    reject(err);
                }
            });
        });
    }

    // Создание нового пользователя
    static async createUser(data: UserCretionData): Promise<User> {
        return new Promise((resolve, reject) => {
            db.transaction(async (trx) => {
                try {
                    const newUser = await User.create({ ...data, role: 'student' }, { client: trx });
                    resolve(newUser);
                    await trx.commit();
                } catch (err) {
                    await trx.rollback();
                    console.error('modules/users/services/users_queries.ts: [UsersQueriesService]:createUser => ', err);
                    reject(err);
                }
            });
        });
    }
}