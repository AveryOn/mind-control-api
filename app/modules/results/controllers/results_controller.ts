
import { HttpContext } from "@adonisjs/core/http";
import { controllerLogger } from "#services/logger/logger_service";
// ### TYPES
import { Err } from "#services/logger/types";
import { ResponseData } from "#types/http_types";
import User from "#models/user";

export default class ResultsController {

    // Получение теста по ID (STUDENT)
    @controllerLogger(import.meta.url)
    async store({ request, response, auth }: HttpContext) {
        //########### Проверка аутентификации ##########
        const student: User = await auth.authenticate();
        // Если контроллер выполнился для пользователя с ролью "student", 
        if(student.role === 'student') {
            // Проверка / валидация полей запроса

            response.send({ meta: { status: 200, url: request.url(), paginator: null }, data: null } as ResponseData);
        } 
        // Админу и Учителю в доступе к маршруту отказано
        else throw { code: "E_FORBIDDEN", status: 403, messages: [ { message: 'Не достаточно прав на выполнение запроса' } ] } as Err;
    }
}