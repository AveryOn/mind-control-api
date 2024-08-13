import db from "@adonisjs/lucid/services/db";
import { Err } from "#services/logger/types";
import { RequestTestData } from "../types/tests_types.js";
import Test from "#models/test";
import QuestionsService from "#modules/questions/services/questions_service";
import { TransactionClientContract } from "@adonisjs/lucid/types/database";


export default class TestsService {

    // Создание нового теста в системе
    static async createNewTest(data: RequestTestData): Promise<any> {
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
                    }
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

}