import { Paginator } from "#types/http_types";

// Объект необходимый для создания нового результата теста (STUDENT)
export interface RequestCreationResultsStd {
    test_id: number;
    duration: number;
    answers: { answer: string; questionId: number }[];
}

// Объект необходимый для получения результатов теста (ADMIN | TEACHER)
export interface RequestFetchResultsTchr {
    test_id: number;
    page?: number;
    per_page?: number; 
}

// Объект необходимый для получения данных результата (ADMIN | TEACHER)
export interface RequestFetchResultTchr {
    test_id: number;
    result_id: number;
}

// Объект результата при извлечении из БД (ADMIN | TEACHER)
export interface FetchResultTchr {
    id: number;
    userId: number;
    testId: number;
    isSuccess: null | boolean;
    isChecked: boolean;
    checkDate: null | string;
    duration: number;
    successCount: number;
    createdAt: string;
    updatedAt: string;
    questionsCount: number;
}

// Ответ при получении результатов теста (ADMIN | TEACHER)
export interface ResponseFetchResultsTchr {
    paginator: Paginator | null;
    results: FetchResultTchr[];
}

// Ответ при получении данных результата по ID (ADMIN | TEACHER)
export type ResponseFetchResultTchr = FetchResultTchr & {
    test: {
        id: number;
        title: string;
        summary: string;
        group: any;
        questionsCount: number;
        createdAt: string;
        updatedAt: string;
        groupId: undefined;
    };
    questions: {
        id: number;
        testId: number;
        number: number;
        question: string;
        type: 'text' | 'checkbox' | 'radio';
        radioAnswers: { answer: string; isCorrect: boolean }[];
        checkboxAnswers: { answer: string; isCorrect: boolean }[];
        createdAt: string;
        updatedAt: string;
    }[];
    answers: {
        id: number;
        resultId: number;
        questionId: number;
        answer: string;
        isCorrect: null | boolean;
        createdAt: string;
        updatedAt: string;
    }[];
    student: {
        id: number;
        name: string;
        login: string;
        role: "student" | "admin" | "teacher";
        createdAt: string;
        updatedAt: string;
    };
}


// Объект данных, необходимый для подтверждения проверки результата (ADMIN | TEACHER)
export interface RequestCheckResultDataTchr {
    check_date: string;
    is_success: boolean;
    result_answers: { id: number; questionId: number; isCorrect: boolean }[];
    result_id: number;
    test_id: number;
}