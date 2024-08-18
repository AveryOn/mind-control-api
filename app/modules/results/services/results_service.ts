import db from "@adonisjs/lucid/services/db";
import { Err } from "#services/logger/types";
import { TransactionClientContract } from "@adonisjs/lucid/types/database";
import { Paginator } from "#types/http_types";
import Result from "#models/result";
import { RequestCreationResultsStd } from "../types/results_types.js";
import User from "#models/user";
import Answer from "#models/answer";


export default class ResultsService {
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
                    const totalCount = await Result.query({client: trxTotalCount}).count('* as total');
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
    static async createNewResultStd({ answers, duration, test_id: testId, userId }: RequestCreationResultsStd, student: User): Promise<any> {
        return new Promise((resolve, reject) => { 
            db.transaction(async (trx: TransactionClientContract) => { 
                try {
                    await student.useTransaction(trx);
                    const newResult: Result = await student.related('results').create({ duration, testId, });
                    newResult.useTransaction(trx);
                    const newAnswers: Answer[] = await newResult.related('answers').createMany([...answers]);
                    await trx.rollback();
                    resolve({ newAnswers, newResult });
                } catch (err) {
                    await trx.rollback();
                    console.error('modules/results/services/results_service.ts: [ResultsService]:createNewResultStd => ', err);
                    reject({ code: "E_INTERNAL", status: 500, messages: [{message: 'Внутрення ошибка сервера'}] } as Err);
                }
            });
        });
    }

}