
// Объект необходимый для создания нового результата теста (STUDENT)
export interface RequestCreationResultsStd {
    test_id: number;
    duration: number;
    answers: { answer: string; questionId: number }[];
}