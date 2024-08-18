import { HttpContext } from "@adonisjs/core/http";
import { controllerLogger } from "#services/logger/logger_service";
// ### TYPES
import { Err } from "#services/logger/types";
import { ResponseData } from "#types/http_types";
import User from "#models/user";
import { creationTestValidator, getTestByIdStudentValidator, getTestsValidatorTeacher } from "../validators/tests_validate.js";
import { FetchStudentTestByID, FetchTeacherTestsParams, RequestTestData, ResponseCreationTestData, ResponseFetchStudentTests, ResponseFetchTeacherTests, TestDataForStudent } from "../types/tests_types.js";
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
            // Создание нового теста
            const newTest: ResponseCreationTestData = await TestsService.createNewTest(validData);
            response.send({ meta: { status: 200, url: request.url(), paginator: null }, data: { test: newTest } } as ResponseData);
        }
    }

    // Получение списка тестов (ADMIN | TEACHER)
    @controllerLogger(import.meta.url)
    async indexTeacher({ request, response, auth }: HttpContext) {
        //########### Проверка аутентификации ##########
        const user: User = await auth.authenticate();
        // Если контроллер выполнился для пользователя с ролью "student", то ошибка 403. Доступ к этому контроллеру есть только у админа и учителя 
        if(user.role === 'student') throw { code: "E_FORBIDDEN", status: 403, messages: [ { message: 'Не достаточно прав на выполнение запроса' } ] } as Err;
        else if(user.role === 'admin' || user.role === 'teacher') {
            // Проверка / валидация полей запроса
            const rawQs = request.qs();
            const validData: FetchTeacherTestsParams = await getTestsValidatorTeacher.validate(rawQs);
            const { paginator, tests }: ResponseFetchTeacherTests = await TestsService.getTestsTeacher(validData);
            response.send({ meta: { status: 200, url: request.url(), paginator }, data: { tests } } as ResponseData);
        }
    }
    // Получение списка тестов (STUDENT)
    @controllerLogger(import.meta.url)
    async indexStudent({ request, response, auth }: HttpContext) {
        //########### Проверка аутентификации ##########
        const student: User = await auth.authenticate();
        // Если контроллер выполнился для пользователя с ролью "student", 
        if(student.role === 'student') {
            // Проверка / валидация полей запроса
            const rawQs = request.qs();
            const validData: FetchTeacherTestsParams = await getTestsValidatorTeacher.validate(rawQs);
            const { paginator, tests }: ResponseFetchStudentTests = await TestsService.getTestsStudent(validData, student);
            response.send({ meta: { status: 200, url: request.url(), paginator }, data: { tests } } as ResponseData);
        } 
        // Админу и Учителю в доступе к маршруту отказано
        else throw { code: "E_FORBIDDEN", status: 403, messages: [ { message: 'Не достаточно прав на выполнение запроса' } ] } as Err;
    }


    // Получение теста по ID (STUDENT)
    @controllerLogger(import.meta.url)
    async getTestByIdStudent({ request, response, auth }: HttpContext) {
        //########### Проверка аутентификации ##########
        const student: User = await auth.authenticate();
        // Если контроллер выполнился для пользователя с ролью "student", 
        if(student.role === 'student') {
            // Проверка / валидация полей запроса
            const rawParams = request.params();
            const validData: FetchStudentTestByID = await getTestByIdStudentValidator.validate(rawParams);
            // Извлечение из БД данных теста 
            const { test }: { test: TestDataForStudent } = await TestsService.getTestByIdStudent(validData, student);
            response.send({ meta: { status: 200, url: request.url(), paginator: null }, data: { test } } as ResponseData);
        } 
        // Админу и Учителю в доступе к маршруту отказано
        else throw { code: "E_FORBIDDEN", status: 403, messages: [ { message: 'Не достаточно прав на выполнение запроса' } ] } as Err;
    }
}