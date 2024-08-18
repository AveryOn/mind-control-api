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

// Сырой объект результата при извлечении из БД (ADMIN | TEACHER)
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