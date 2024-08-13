import { HttpContext } from "@adonisjs/core/http";
import User from "#models/user";
import UsersQueriesService from "../services/users_queries.js";
import { controllerLogger } from "#services/logger/logger_service";
import { usersFetchParamsValidate } from '../validators/users_validate.js';
// ### TYPES
import { FetchUsersParams, GetUsersResponse } from "../types/user_types.js";
import { Err } from "#services/logger/types";
import { ResponseData } from "#types/http_types";

export default class UserController {

    // Получение списка пользователей
    @controllerLogger(import.meta.url)
    async getUsers({ request, response, auth }: HttpContext) {
        //########### Проверка аутентификации ##########
        const user: User = await auth.authenticate();
        // Если контроллер выполнился для пользователя с ролью "student" то ошибка 403. Доступ к этому контроллеру есть только у админа и учителя 
        if(user.role === 'student') throw { code: "E_FORBIDDEN", status: 403, messages: [ { message: 'Не достаточно прав на выполнение запроса' } ] } as Err;
        if(user.role === 'admin' || user.role === 'teacher') {
            // Проверка/валидация входных параметров
            const rawParams = request.qs();
            const valideParams: FetchUsersParams = await usersFetchParamsValidate.validate(rawParams);
            // Извлечение списка пользователей по пагинации
            const { paginator, users }: GetUsersResponse = await UsersQueriesService.getUsers(valideParams).catch((err: Err) => { throw err });
            response.send({ meta: { status: 200, url: request.url(), paginator }, data: users } as ResponseData);
        } 
        else throw { code: "E_INTERNAL", status: 500, messages: [ { message: 'Внутренняя ошибка сервера' } ] } as Err;
    }
}