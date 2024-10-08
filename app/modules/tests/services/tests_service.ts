import db from "@adonisjs/lucid/services/db";
import { Err } from "#services/logger/types";
import { FetchStudentTestByID, FetchStudentTestsParams, FetchTeacherTestByID, FetchTeacherTestsParams, RequestTestData, ResponseCreationTestData, ResponseFetchStudentTests, ResponseFetchTeacherTests, TestDataForStudent, TestDataForTeacher } from "../types/tests_types.js";
import Test from "#models/test";
import QuestionsService from "#modules/questions/services/questions_service";
import { TransactionClientContract } from "@adonisjs/lucid/types/database";
import { Paginator } from "#types/http_types";
import User from "#models/user";


export default class TestsService {
    // Инициализация пагинатора
    static async initPaginator(page?: number, perPage?: number): Promise<Paginator | null> {
        return new Promise(async (resolve, reject) => {
            if((page && !perPage) || (!page && perPage)) reject({ code: "E_VALIDATION_ERROR", status: 422, messages: [{ message: 'Проверьте корректность параметров запроса' }] } as Err);
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
                    const totalCount = await Test.query({client: trxTotalCount}).count('* as total');
                    let total = totalCount[0].$extras.total;
                    if(total) paginator.total = +total;
                    await trxTotalCount.commit();
                } catch (err) {
                    await trxTotalCount.rollback();
                    console.error(`modules/tests/services/tests_service.ts: TestsService:[initPaginator > totalCount]  => `, err);
                    return reject({ code: "E_INTERNAL", status: 500, messages: [{ message: 'Внутренняя ошибка сервера' }] } as Err);
                }
                // Вычисление значений для пагинатора
                try {
                    paginator.currentPage = +page;
                    let limit = +perPage;
                    paginator.perPage = +perPage;
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
                    console.error(`modules/tests/services/tests_service.ts: UsersQueriesService:[initPaginator > filled paginator]  => `, err);
                    reject({ code: "E_INTERNAL", status: 500, messages: [{ message: 'Внутренняя ошибка сервера' }] } as Err);
                }
            } else {
                resolve(null);
            }
        });
    }

    // Создание нового теста в системе
    static async createNewTest(data: RequestTestData): Promise<ResponseCreationTestData> {
        return new Promise((resolve, reject) => { 
            db.transaction(async (trx: TransactionClientContract) => { 
                try {
                    const readyCreationData = { group_id: data.group_id, title: data.title, summary: data.summary, questions_count: data.questions.length }
                    const newTest: Test = await Test.create({...readyCreationData}, { client: trx });
                    const questions = await QuestionsService.createQuestionsForTest(newTest, data.questions, trx).catch(async (err) => { await trx.rollback(); throw err });
                    await newTest.related('users').attach(data.participants, trx).catch(async (err) => { await trx.rollback(); throw err });
                    await newTest.load('group');
                    const readyNewTestData = {
                        ...newTest.toJSON(),
                        participantsCount: data.participants.length,
                        questionsCount: questions.length,
                    } as ResponseCreationTestData;
                    Reflect.deleteProperty(readyNewTestData, 'groupId');
                    await trx.commit();
                    resolve(readyNewTestData);
                } catch (err) {
                    await trx.rollback();
                    console.error('modules/tests/services/tests_service.ts: [TestsService]:createNewTest => ', err);
                    reject({ code: "E_INTERNAL", status: 500, messages: [{message: 'Внутрення ошибка сервера'}] } as Err);
                }
            });
        });
    }

    // Получение списка тестов (ADMIN | TEACHER)
    static async getTestsTeacher({ page, per_page }: FetchTeacherTestsParams): Promise<ResponseFetchTeacherTests> {
        return new Promise((resolve, reject) => { 
            db.transaction(async (trx: TransactionClientContract) => { 
                try {
                    // Вычисление смещения данных для пагинации по perPage относительно запрашиваемой страницы пагинации
                    function compOffset(paginator: Paginator) {
                        if (paginator) return (paginator.currentPage! - 1) * paginator.perPage!;
                        else return 0;
                    }
                    const paginator = await this.initPaginator(page, per_page).catch((err: Err) => { throw err });
                    let tests: Test[];
                    if(paginator) {
                        tests = await Test
                        .query({ client: trx })
                        .select(['*'])
                        .preload('group')
                        .withAggregate('users', (query) => {
                            query.count('*').as('users_count')
                        })
                        .orderBy('created_at', 'asc')
                        .offset(compOffset(paginator))
                        .limit(paginator.perPage!);
                    }
                    // Если пагинатор не определен, то извлечение всех записей
                    else {
                        tests = await Test
                        .query({ client: trx })
                        .select(['*'])
                        .preload('group')
                        .withAggregate('users', (query) => {
                            query.count('*').as('users_count')
                        })
                        .orderBy('created_at', 'asc');
                    }
                    let readyTest: ResponseCreationTestData[] = [];
                    // Сборка итоговых данных тестов. В них включается кол-во привязанных пользователей
                    tests.forEach((test) => {
                        readyTest.push({
                            ...test.toJSON(),
                            participantsCount: +test.$extras.users_count,
                        } as ResponseCreationTestData);
                    });

                    await trx.commit();
                    resolve({ paginator, tests: readyTest });
                } catch (err) {
                    await trx.rollback();
                    console.error('modules/tests/services/tests_service.ts: [TestsService]:getTestsTeacher => ', err);
                    reject({ code: "E_INTERNAL", status: 500, messages: [{message: 'Внутрення ошибка сервера'}] } as Err);
                }
            });
        });
    }

    // Получение списка тестов (STUDENT)
    static async getTestsStudent({ page, per_page, only_checked }: FetchStudentTestsParams, student: User): Promise<ResponseFetchStudentTests> {
        return new Promise((resolve, reject) => { 
            db.transaction(async (trx: TransactionClientContract) => { 
                try {
                    // Вычисление смещения данных для пагинации по perPage относительно запрашиваемой страницы пагинации
                    function compOffset(paginator: Paginator) {
                        if (paginator) return (paginator.currentPage! - 1) * paginator.perPage!;
                        else return 0;
                    }
                    const paginator = await this.initPaginator(page, per_page).catch((err: Err) => { throw err });
                    let tests: Test[];
                    if(paginator) {
                        student.useTransaction(trx)
                        tests = await student.related('tests')
                            .query()
                            .select(['*'])
                            .preload('group')
                            .preload('results', (resultQuery) => {
                                resultQuery
                                    .select(['id', 'user_id', 'test_id', 'is_success', 'is_checked', 'check_date', 'duration', 'success_count'])
                                    .where('user_id', student.id)
                                    .orderBy('created_at', 'desc')
                                    .groupLimit(1);
                            })
                            .orderBy('created_at', 'asc')
                            .offset(compOffset(paginator))
                            .limit(paginator.perPage!);
                    }
                    // Если пагинатор не определен, то извлечение всех записей
                    else {
                        student.useTransaction(trx)
                        tests = await student.related('tests')
                            .query()
                            .select(['*'])
                            .preload('group')
                            .preload('results', (resultQuery) => {
                                resultQuery
                                    .select(['id', 'user_id', 'test_id', 'is_success', 'is_checked', 'check_date', 'duration', 'success_count'])
                                    .where('user_id', student.id)
                                    .orderBy('created_at', 'desc')
                                    .groupLimit(1);
                            })
                            .orderBy('created_at', 'asc');
                    }
                    let readyTest: TestDataForStudent[] = [];
                    // Сборка итоговых данных тестов.
                    tests.forEach((test) => {
                        // Если Опция "only_checked" равна - true, то не пропускаем в итоговый массив те тесты, которые не имеют результатов
                        if(only_checked === true) {
                            if(!test.results.length) return;
                            else {
                                return readyTest.push({
                                    ...test.toJSON(),
                                    result: null,
                                    results: undefined,
                                } as TestDataForStudent);
                            }
                        }
                        readyTest.push({
                            ...test.toJSON(),
                            result: (test.results.length)? test.results[0].toJSON() : null,
                            results: undefined,
                        } as TestDataForStudent);
                    });
                            
                    

                    await trx.commit();
                    resolve({ paginator, tests: readyTest });
                } catch (err) {
                    await trx.rollback();
                    console.error('modules/tests/services/tests_service.ts: [TestsService]:getTestsStudent => ', err);
                    reject({ code: "E_INTERNAL", status: 500, messages: [{message: 'Внутрення ошибка сервера'}] } as Err);
                }
            });
        });
    }

    // Получение теста по ID (STUDENT)
    static async getTestByIdStudent({ test_id }: FetchStudentTestByID, student: User): Promise<{ test: TestDataForStudent }> {
        return new Promise((resolve, reject) => { 
            db.transaction(async (trx: TransactionClientContract) => { 
                try {
                    student.useTransaction(trx)
                    const test = await student.related('tests')
                        .query()
                        .select(['*'])
                        .where('tests.id', test_id)
                        .preload('group')
                        .preload('results', (resultQuery) => {
                            resultQuery
                                .select(['id', 'user_id', 'test_id', 'is_success', 'is_checked', 'check_date', 'duration', 'success_count'])
                                .where('user_id', student.id)
                                .orderBy('created_at', 'desc')
                                .groupLimit(1);
                        })
                        .orderBy('created_at', 'asc')
                        .firstOrFail();
                    
                    await trx.commit();
                    let readyTest: TestDataForStudent;
                    readyTest = {
                        ...test.toJSON(),
                        result: (test.results.length)? test.results[0].toJSON() : null,
                        results: undefined,
                    } as TestDataForStudent;
                    resolve({ test: readyTest });
                } catch (err) {
                    await trx.rollback();
                    console.error('modules/tests/services/tests_service.ts: [TestsService]:getTestByIdStudent => ', err);
                    reject({ code: "E_INTERNAL", status: 500, messages: [{message: 'Внутрення ошибка сервера'}] } as Err);
                }
            });
        });
    }

    // Получение теста по ID (ADMIN | TEACHER)
    static async getTestByIdTeacher({ test_id }: FetchTeacherTestByID): Promise<{ test: TestDataForTeacher }> {
        return new Promise((resolve, reject) => { 
            db.transaction(async (trx: TransactionClientContract) => { 
                try {
                    const test = await Test
                        .query({ client: trx })
                        .select(['*'])
                        .where('id', test_id)
                        .preload('group')
                        .orderBy('created_at', 'asc')
                        .firstOrFail();
                    await trx.commit();
                    let readyTest: TestDataForTeacher;
                    readyTest = test.toJSON() as TestDataForTeacher;
                    readyTest.result = null;
                    resolve({ test: readyTest });
                } catch (err) {
                    await trx.rollback();
                    console.error('modules/tests/services/tests_service.ts: [TestsService]:getTestByIdTeacher => ', err);
                    reject({ code: "E_INTERNAL", status: 500, messages: [{message: 'Внутрення ошибка сервера'}] } as Err);
                }
            });
        });
    }
}