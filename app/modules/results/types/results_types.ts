
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