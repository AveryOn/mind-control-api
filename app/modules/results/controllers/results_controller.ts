
import { HttpContext } from "@adonisjs/core/http";
import { controllerLogger } from "#services/logger/logger_service";
// ### TYPES
import { Err } from "#services/logger/types";
import { ResponseData } from "#types/http_types";
import User from "#models/user";
import { resultCreationValidator } from "../validators/results_validate.js";
import ResultsService from "../services/results_service.js";
import { RequestCreationResultsStd } from "../types/results_types.js";

export default class ResultsController {

    // Получение теста по ID (STUDENT)
    @controllerLogger(import.meta.url)
    async store({ request, response, auth }: HttpContext) {
        //########### Проверка аутентификации ##########
        const student: User = await auth.authenticate();
        // Если контроллер выполнился для пользователя с ролью "student", 
        if(student.role === 'student') {
            const rawParams = request.params();
            const rawBody = request.only(['duration', 'answers']);
            // Проверка / валидация полей запроса
            const valideData: RequestCreationResultsStd = await resultCreationValidator.validate({ ...rawParams, ...rawBody });
            // Создание результата в БД
            await ResultsService.createNewResultStd(valideData, student);
            response.send({ meta: { status: 200, url: request.url(), paginator: null }, data: null } as ResponseData);
        } 
        // Админу и Учителю в доступе к маршруту отказано
        else throw { code: "E_FORBIDDEN", status: 403, messages: [ { message: 'Не достаточно прав на выполнение запроса' } ] } as Err;
    }
}