import User from "#models/user";
import db from "@adonisjs/lucid/services/db";
import { UserCretionData, UserLoginData, ResultLoginUserData, UserForClient, TokenForClient, FetchParamsUsers, Paginator } from "../types/user_types.js";
import { Err } from "#services/logger/types";


export default class UsersQueriesService {

    static async initPaginator(page?: number, perPage?: number): Promise<any> {
        return new Promise(async (resolve, reject) => {
            if((page && !perPage) || (!page && perPage)) return reject({ code: "E_VALIDATION_ERROR", status: 422, messages: [{message: 'Проверьте корректность параметров запроса'}] } as Err);
            if(page && perPage) {
                // Объект пагинатора
                let paginator: Paginator = {
                    total: undefined,
                    perPage: undefined,
                    currentPage: undefined,
                    firstPage: undefined,
                    lastPage: undefined,
                    hasNext: undefined,
                    hasPrev: undefined,
                }
                // Вычисление значений для пагинатора
                const trxTotalCount = await db.transaction();
                try {
                    // Вычисление общего количества строк в таблице
                    const totalCount = await User.query({client: trxTotalCount}).count('* as total');
                    let total = totalCount[0].$extras.total;
                    if(total) paginator.total = +total;
                    await trxTotalCount.commit();
                } catch (err) {
                    await trxTotalCount.rollback();
                    console.error(`modules/users/services/users_queries.ts: UsersQueriesService:[initPaginator > totalCount]  => `, err);
                    return reject({ code: "E_INTERNAL", status: 500, messages: [{message: 'Внутренняя ошибка сервера'}] } as Err);
                }
                // Вычисление значений для пагинатора
                try {
                    paginator.currentPage = +page;
                    let limit = +perPage;
                    paginator.hasPrev = false;
                    paginator.hasNext = false;
                    paginator.lastPage = Math.ceil(paginator.total! / limit);
                    paginator.firstPage = 1;
                    if (paginator.currentPage == paginator.lastPage) paginator.lastPage = null;
                    if (paginator.currentPage == paginator.firstPage) paginator.firstPage = null;
                    if (paginator.firstPage && paginator.currentPage > paginator.firstPage) paginator.hasPrev = true;
                    if (paginator.lastPage && paginator.currentPage < paginator.lastPage) paginator.hasNext = true;
                    resolve(paginator);
                } catch (err) {
                    console.error(`modules/users/services/users_queries.ts: UsersQueriesService:[initPaginator > filled paginator]  => `, err);
                    return reject({ code: "E_INTERNAL", status: 500, messages: [{message: 'Внутренняя ошибка сервера'}] } as Err);
                }
            }
        });
    }

    // Создание нового токена доступа для пользователя
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
    // Извлечение списка пользоватлей
    static async getUsers(params: FetchParamsUsers) {
        return new Promise((resolve, reject) => {
            db.transaction(async (trx) => {
                try {
                    // const user: User = await User.query({client: trx}).select('*')
                    const paginator = await this.initPaginator(params.page, params.per_page);
                    resolve(paginator);
                    await trx.commit();
                } catch (err) {
                    await trx.rollback();
                    console.error('modules/users/services/users_queries.ts: [UsersQueriesService]:getUsers => ', err);
                    reject(err);
                }
            });
        });
    }
}