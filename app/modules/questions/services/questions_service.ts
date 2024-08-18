import db from "@adonisjs/lucid/services/db";
import { Err } from "#services/logger/types";
import Test from "#models/test";
import { QuestionItemCreation } from "#modules/tests/types/tests_types";
import Question from "#models/question";
import { TransactionClientContract } from "@adonisjs/lucid/types/database";
import { GeneralQuestionData, RequestStudentParamsForGetList, ResponseStudentGetQuestionsData, ResponseStudentQuestion } from "../types/questions_types.js";


export default class QuestionsService {

    // Создание списка вопросов для определенного теста
    static async createQuestionsForTest(test: Test, questionsData: QuestionItemCreation[], trx: TransactionClientContract): Promise<any> {
        return new Promise(async (resolve, reject) => { 
            try {
                const formattedQuestionsData = questionsData.map((question) => {
                    const newQuestion: Question = new Question();
                    newQuestion.testId = test.id;
                    newQuestion.number = question.number;
                    newQuestion.question = question.question;
                    newQuestion.type = question.type;
                    newQuestion.radioAnswers = JSON.stringify(question.radio_answers);
                    newQuestion.checkboxAnswers = JSON.stringify(question.checkbox_answers);
                    return newQuestion;
                });
                const newQuestions: Question[] = await test.related('questions').createMany(formattedQuestionsData, { client: trx });
                resolve(newQuestions);
            } catch (err) {
                console.error('modules/questions/services/questions_service.ts: [QuestionsService]:createQuestionsForTest => ', err);
                reject({ code: "E_INTERNAL", status: 500, messages: [{message: 'Внутренняя ошибка сервера'}] } as Err);
            }
        });
    }

    // Получение списка вопросов теста (STUDENT)
    static async getListQuestionsStudent({ test_id }: RequestStudentParamsForGetList): Promise<ResponseStudentGetQuestionsData> {
        return new Promise(async (resolve, reject) => { 
            db.transaction(async (trx: TransactionClientContract) => {  
                try {
                    const questions: Question[] = await Question
                        .query({ client: trx })
                        .select('*')
                        .where('test_id', test_id)
                    await trx.commit();
                    const readyListQuestions: ResponseStudentQuestion[] = [];
                    // Преобразование объектов вопроса, для того чтобы извлечь у вариантов ответа ключ isCorrect который ученик получать не должен
                    questions.forEach((question) => {
                        const questionJson: GeneralQuestionData = question.toJSON() as GeneralQuestionData;
                        readyListQuestions.push({
                            ...questionJson,
                            checkboxAnswers: questionJson.checkboxAnswers.map((item) => ({ answer: item.answer })),
                            radioAnswers: questionJson.radioAnswers.map((item) => ({ answer: item.answer })),
                        } as ResponseStudentQuestion);
                    });
                    resolve({ questions: readyListQuestions });
                } catch (err) {
                    await trx.rollback();
                    console.error('modules/questions/services/questions_service.ts: [QuestionsService]:getListQuestionsStudent => ', err);
                    reject({ code: "E_INTERNAL", status: 500, messages: [{message: 'Внутренняя ошибка сервера'}] } as Err);
                }
            });
        });
    }
}