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
    participantsCount: number | null;
    createdAt: string;
    updatedAt: string;
    group: {
        id: number;
        title: string;
        createdAt: string;
        updatedAt: string;
    };
}

// Объект данных теста для отправки его ученику по запросу на получение (STUDENT)
export interface TestDataForStudent {
    id: number;
    title: string;
    summary: string | null;
    questionsCount: number;
    participantsCount: number | null;
    createdAt: string;
    updatedAt: string;
    group: {
        id: number;
        title: string;
        createdAt: string;
        updatedAt: string;
    };
    result: {
        isCheck: boolean;
        checkDate: string | null;
        isSuccess: boolean | null;
        successCount: number | null;
        duration: number;
    } | null;
    results: undefined;
}

// Объект данных теста для отправки его учителю по запросу на получение (ADMIN | TEACHER)
export interface TestDataForTeacher {
    id: number;
    title: string;
    summary: string | null;
    questionsCount: number;
    participantsCount: number | null;
    createdAt: string;
    updatedAt: string;
    group: {
        id: number;
        title: string;
        createdAt: string;
        updatedAt: string;
    };
    result: null;
    results: undefined;
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

// Объект параметров запроса для получения списка тестов (STUDENT)
export interface FetchStudentTestsParams {
    page?: number;
    per_page?: number;
    only_checked?: boolean;
}

// Объект данных возвращается на клиент после извлечения тестов с БД (STUDENT)
export interface ResponseFetchStudentTests {
    paginator: Paginator | null;
    tests: TestDataForStudent[];
}

// Объект параметров для получения теста по ID (STUDENT)
export interface FetchStudentTestByID {
    test_id: number;
}

// Объект параметров для получения теста по ID (ADMIN | TEACHER)
export interface FetchTeacherTestByID {
    test_id: number;
}