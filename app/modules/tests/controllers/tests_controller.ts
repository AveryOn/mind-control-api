import { HttpContext } from "@adonisjs/core/http";
import { controllerLogger } from "#services/logger/logger_service";
// ### TYPES
import { Err } from "#services/logger/types";
import { ResponseData } from "#types/http_types";
import User from "#models/user";
import { creationTestValidator } from "../validators/tests_validate.js";
import { RequestTestData } from "../types/tests_types.js";
import TestsService from "../services/tests_service.js";

export default class TestsController {
    // Создание нового теста
    @controllerLogger(import.meta.url)
    async store({ request, response, auth }: HttpContext) {
        //########### Проверка аутентификации ##########
        const user: User = await auth.authenticate();
        // Если контроллер выполнился для пользователя с ролью "student" то ошибка 403. Доступ к этому контроллеру есть только у админа и учителя 
        if(user.role === 'student') throw { code: "E_FORBIDDEN", status: 403, messages: [ { message: 'Не достаточно прав на выполнение запроса' } ] } as Err;
        if(user.role === 'admin' || user.role === 'teacher') {
            // Проверка / валидация полей запроса
            const rawBody = request.only(['title', 'summary', 'group_id', 'participants', 'questions']);
            const validData: RequestTestData = await creationTestValidator.validate(rawBody);
            const newTest = await TestsService.createNewTest(validData);
            response.send({ meta: { status: 200, url: request.url(), paginator: null }, data: { test: newTest } } as ResponseData);
        }
    }

    // Получение списка тестов
    @controllerLogger(import.meta.url)
    async index({ request, response, auth }: HttpContext) {
        //########### Проверка аутентификации ##########
        const user: User = await auth.authenticate();
        // Если контроллер выполнился для пользователя с ролью "student" то ошибка 403. Доступ к этому контроллеру есть только у админа и учителя 
        if(user.role === 'student') throw { code: "E_FORBIDDEN", status: 403, messages: [ { message: 'Не достаточно прав на выполнение запроса' } ] } as Err;
        if(user.role === 'admin' || user.role === 'teacher') {
            // Проверка / валидация полей запроса
            const rawBody = request.only(['title', 'summary', 'group_id', 'participants', 'questions']);
            const validData: RequestTestData = await creationTestValidator.validate(rawBody);
            const newTest = await TestsService.createNewTest(validData);
            response.send({ meta: { status: 200, url: request.url(), paginator: null }, data: { test: newTest } } as ResponseData);
        }
    }
}