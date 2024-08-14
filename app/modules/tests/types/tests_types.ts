import Test from "#models/test";
import { Paginator } from "#types/http_types";

// Единица вопроса теста для создания
export interface QuestionItemCreation {
    number: number;
    checkbox_answers: {answer: number | string, is_correct: boolean}[];
    question: string;
    radio_answers: {answer: number | string, is_correct: boolean}[];
    type: 'checkbox' | 'radio' | 'text';
}

// Данные необходимые приходящие с клиента для создания нового теста
export interface RequestTestData {
    title: string;
    summary?: string;
    group_id: number;
    participants: number[];
    questions: QuestionItemCreation[];
}

// Объект данных теста после его создания, который необходимо вернуть на клиент
export interface ResponseCreationTestData {
    id: number;
    title: string;
    summary: string | null;
    questionsCount: number;
    participantsCount: number;
    createdAt: string;
    updatedAt: string;
    group: {
        id: number;
        title: string;
        createdAt: string;
        updatedAt: string;
    };
}

// Объект параметров запроса для получения списка тестов (ADMIN | TEACHER)
export interface FetchTeacherTestsParams {
    page?: number;
    per_page?: number;
}

// Объект данных возвращается на клиент после извлечения тестов с БД (ADMIN | TEACHER)
export interface ResponseFetchTeacherTests {
    paginator: Paginator | null;
    tests: ResponseCreationTestData[];
}
