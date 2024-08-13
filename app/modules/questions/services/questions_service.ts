import db from "@adonisjs/lucid/services/db";
import { Err } from "#services/logger/types";
import Test from "#models/test";
import { QuestionItemCreation } from "#modules/tests/types/tests_types";
import Question from "#models/question";
import { TransactionClientContract } from "@adonisjs/lucid/types/database";


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
                reject({ code: "E_INTERNAL", status: 500, messages: [{message: 'Внутрення ошибка сервера'}] } as Err);
            }
        });
    }

}