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