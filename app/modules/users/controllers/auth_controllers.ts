import { HttpContext } from "@adonisjs/core/http";
import { creationUserValidate } from "../validators/creation_user_validate.js";
import UsersQueriesService from "../services/users_queries.js";
import User from "#models/user";
import { controllerLogger } from "#services/logger/logger_service";
import { loginUserValidate } from "../validators/login_user_validate.js";
import { ResultLoginUserData, UserCretionData, UserLoginData } from "../types/user_types.js";
import { Err } from "#services/logger/types";


export default class AuthController {

    // Авторизация в системе
    @controllerLogger(import.meta.url)
    async login({ request, response }: HttpContext) {
        const rawBody = request.only(['login', 'password',]);
        const valideBody: UserLoginData = await loginUserValidate.validate(rawBody);
        const loginData: ResultLoginUserData | null = await UsersQueriesService.loginUser(valideBody);
        if(!loginData) throw { code: "E_NOT_FOUND_DATA", status: 404, messages: [ { message: 'Неверные учетные данные' } ] } as Err;
        response.send({ meta: { status: 200, url: request.url() }, data: loginData });
    }

    // Регистрация пользователя в системе
    @controllerLogger(import.meta.url)
    async logup({ request, response }: HttpContext) {
        const rawBody = request.only(['name', 'login', 'password',]);
        const valideBody: UserCretionData = await creationUserValidate.validate(rawBody);
        const user: User = await UsersQueriesService.createUser(valideBody);
        const readyUser = user.toJSON();
        Reflect.deleteProperty(readyUser, 'password'); // Удаление пароля из итогового объекта данных
        response.send({ meta: { status: 200, url: request.url() }, data: readyUser });
    }
}