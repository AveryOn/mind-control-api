
import { HttpContext } from "@adonisjs/core/http";
import { controllerLogger } from "#services/logger/logger_service";
// ### TYPES
import { Err } from "#services/logger/types";
import { ResponseData } from "#types/http_types";
import User from "#models/user";
import { resultCheckValidatorTchr, resultCreationValidator, resultFetchValidatorTchr, resultsFetchValidatorTchr } from "../validators/results_validate.js";
import ResultsService from "../services/results_service.js";
import { RequestCheckResultDataTchr, RequestCreationResultsStd, RequestFetchResultTchr, RequestFetchResultsTchr, ResponseFetchResultTchr, ResponseFetchResultsTchr } from "../types/results_types.js";

export default class ResultsController {

    // Создание нового результата для теста (STUDENT)
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
            await ResultsService.createNewResultStd(valideData, student).catch((err: Err) => { throw err });
            response.send({ meta: { status: 200, url: request.url(), paginator: null }, data: null } as ResponseData);
        } 
        // Админу и Учителю в доступе к маршруту отказано
        else throw { code: "E_FORBIDDEN", status: 403, messages: [ { message: 'Не достаточно прав на выполнение запроса' } ] } as Err;
    }

    // Получение результатов теста (ADMIN | TEACHER)
    @controllerLogger(import.meta.url)
    async indexTeacher({ request, response, auth }: HttpContext) {
        //########### Проверка аутентификации ##########
        const user: User = await auth.authenticate();
        // Если контроллер выполнился для пользователя с ролью "student", то ошибка 403. Доступ к этому контроллеру есть только у админа и учителя 
        if(user.role === 'student') throw { code: "E_FORBIDDEN", status: 403, messages: [ { message: 'Не достаточно прав на выполнение запроса' } ] } as Err;
        else if(user.role === 'admin' || user.role === 'teacher') {
            // Проверка / валидация полей запроса
            const rawParams = request.params();
            const rawQs = request.qs();
            const valideData: RequestFetchResultsTchr = await resultsFetchValidatorTchr.validate({ ...rawParams, ...rawQs });
            // Извлечение результатов теста из БД
            const { paginator, results }: ResponseFetchResultsTchr = await ResultsService.getResultsTchr(valideData, user).catch((err: Err) => { throw err });
            response.send({ meta: { status: 200, url: request.url(), paginator }, data: { results } } as ResponseData);
        }
    }

    // Получение результата по ID (ADMIN | TEACHER)
    @controllerLogger(import.meta.url)
    async getResultByIdTeacher({ request, response, auth }: HttpContext) {
        //########### Проверка аутентификации ##########
        const user: User = await auth.authenticate();
        // Если контроллер выполнился для пользователя с ролью "student", то ошибка 403. Доступ к этому контроллеру есть только у админа и учителя 
        if(user.role === 'student') throw { code: "E_FORBIDDEN", status: 403, messages: [ { message: 'Не достаточно прав на выполнение запроса' } ] } as Err;
        else if(user.role === 'admin' || user.role === 'teacher') {
            // Проверка / валидация полей запроса
            const rawParams = request.params();
            const valideData: RequestFetchResultTchr = await resultFetchValidatorTchr.validate(rawParams);
            // Извлечение результа по ID из БД
            const { result }: { result: ResponseFetchResultTchr } = await ResultsService.getResultByIdTchr(valideData).catch((err: Err) => { throw err });
            response.send({ meta: { status: 200, url: request.url(), paginator: null }, data: { result } } as ResponseData);
        }
    }

    // Проверка результата теста учителем (ADMIN | TEACHER)
    @controllerLogger(import.meta.url)
    async checkResultTchr({ request, response, auth }: HttpContext) {
        //########### Проверка аутентификации ##########
        const user: User = await auth.authenticate();
        // Если контроллер выполнился для пользователя с ролью "student", то ошибка 403. Доступ к этому контроллеру есть только у админа и учителя 
        if(user.role === 'student') throw { code: "E_FORBIDDEN", status: 403, messages: [ { message: 'Не достаточно прав на выполнение запроса' } ] } as Err;
        else if(user.role === 'admin' || user.role === 'teacher') {
            // Проверка / валидация полей запроса
            const rawParams = request.params();
            const rawBody = request.only(['check_date', 'is_success', 'result_answers'])
            const valideData: RequestCheckResultDataTchr = await resultCheckValidatorTchr.validate({ ...rawParams, ...rawBody });
            // Извлечение результа по ID из БД
            // const { result }: { result: ResponseFetchResultTchr } = await ResultsService.getResultByIdTchr(valideData).catch((err: Err) => { throw err });
            response.send({ meta: { status: 200, url: request.url(), paginator: null }, data: valideData } as ResponseData);
        }
    }
}