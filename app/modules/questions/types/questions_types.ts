
// Данные необходимые для получения списка вопросов (STUDENT)
export interface RequestStudentParamsForGetList {
    test_id: number;
}

// Объект вопроса, который получает клиент (STUDENT)
export interface ResponseStudentQuestion {
    id: number;
    testId: number;
    number: number;
    question: string;
    type: 'text' | 'radio' | 'checkbox';
    radioAnswers: { answer: string }[];
    checkboxAnswers: { answer: string }[];
    createdAt: string;
    updatedAt: string;
}

// Объект который возвращает сервис по получению вопросов (STUDENT)
export interface ResponseStudentGetQuestionsData {
    questions: ResponseStudentQuestion[];
}

// Общий объект вопроса который приходит с БД
export interface GeneralQuestionData {
    id: number;
    testId: number;
    number: number;
    question: string;
    type: 'text' | 'radio' | 'checkbox';
    radioAnswers: { answer: string, isCorrect: boolean }[];
    checkboxAnswers: { answer: string, isCorrect: boolean }[];
    createdAt: string;
    updatedAt: string;
}