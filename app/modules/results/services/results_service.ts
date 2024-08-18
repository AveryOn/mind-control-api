import db from "@adonisjs/lucid/services/db";
import { Err } from "#services/logger/types";
import { TransactionClientContract } from "@adonisjs/lucid/types/database";
import { Paginator } from "#types/http_types";
import Result from "#models/result";
import { FetchResultTchr, RequestCreationResultsStd, RequestFetchResultsTchr, ResponseFetchResultsTchr } from "../types/results_types.js";
import User from "#models/user";
import Answer from "#models/answer";


export default class ResultsService {
    // Инициализация пагинатора
    static async initPaginator(testId: number, page?: number, perPage?: number): Promise<Paginator | null> {
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
                    const totalCount = await Result.query({client: trxTotalCount}).where('test_id', testId).count('* as total');
                    let total = totalCount[0].$extras.total;
                    if(total) paginator.total = +total;
                    await trxTotalCount.commit();
                } catch (err) {
                    await trxTotalCount.rollback();
                    console.error(`modules/results/services/results_service.ts: [ResultsService]:[initPaginator > totalCount]  => `, err);
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
                    console.error(`modules/results/services/results_service.ts: [ResultsService]:[initPaginator > filled paginator]  => `, err);
                    reject({ code: "E_INTERNAL", status: 500, messages: [{ message: 'Внутренняя ошибка сервера' }] } as Err);
                }
            } else {
                resolve(null);
            }
        });
    }

    // Создание нового результата для теста (STUDENT)
    static async createNewResultStd({ answers, duration, test_id: testId }: RequestCreationResultsStd, student: User): Promise<null> {
        return new Promise((resolve, reject) => { 
            db.transaction(async (trx: TransactionClientContract) => { 
                try {
                    await student.useTransaction(trx);
                    // Создание результата
                    const newResult: Result = await student.related('results').create({ duration, testId, });
                    newResult.useTransaction(trx);
                    // Создание связанных с новым результатом ответов
                    await newResult.related('answers').createMany([...answers]);
                    await trx.commit();
                    resolve(null);
                } catch (err) {
                    await trx.rollback();
                    console.error('modules/results/services/results_service.ts: [ResultsService]:createNewResultStd => ', err);
                    reject({ code: "E_INTERNAL", status: 500, messages: [{message: 'Внутрення ошибка сервера'}] } as Err);
                }
            });
        });
    }

    // Получение результатов (ADMIN | TEACHER)
    static async getResultsTchr({ page, per_page, test_id }: RequestFetchResultsTchr, teacher: User): Promise<ResponseFetchResultsTchr> {
        return new Promise((resolve, reject) => { 
            db.transaction(async (trx: TransactionClientContract) => { 
                try {
                    // Вычисление смещения данных для пагинации по perPage относительно запрашиваемой страницы пагинации
                    function compOffset(paginator: Paginator) {
                        if (paginator) return (paginator.currentPage! - 1) * paginator.perPage!;
                        else return 0;
                    }
                    // Инициализация пагинатора
                    const paginator = await this.initPaginator(test_id, page, per_page).catch((err: Err) => { throw err });
                    let results: Result[];
                    if(paginator) {
                        results = await Result
                            .query({ client: trx })
                            .select('*')
                            .where('test_id', test_id)
                            .preload('test', (testQuery) => {
                                testQuery.select('questions_count').as('questions_count')
                            })
                            .orderBy('created_at', 'asc')
                            .offset(compOffset(paginator))
                            .limit(paginator.perPage!);
                    }
                    // Если пагинатор не определен, то извлечение всех записей
                    else {
                        results = await Result
                            .query({ client: trx })
                            .select('*')
                            .where('test_id', test_id)
                            .preload('test', (testQuery) => {
                                testQuery.select(['questions_count']).as('questions_count');
                            })
                            .orderBy('created_at', 'asc')
                    }
                    await trx.commit();
                    let readyResults: FetchResultTchr[] = [];
                    // Форматирование итоговых объектов result для добавления ключа questionsCount и удаления test
                    readyResults = [...results.map((result) => {
                        const readyResult = {
                            ...result.toJSON(),
                            questionsCount: result.test.questionsCount,
                        } as FetchResultTchr;
                        Reflect.deleteProperty(readyResult, 'test');
                        return readyResult;
                    })] 
                    resolve({ paginator, results: readyResults });
                } catch (err) {
                    await trx.rollback();
                    console.error('modules/results/services/results_service.ts: [ResultsService]:getResultsTchr => ', err);
                    reject({ code: "E_INTERNAL", status: 500, messages: [{message: 'Внутрення ошибка сервера'}] } as Err);
                }
            });
        });
    }
}