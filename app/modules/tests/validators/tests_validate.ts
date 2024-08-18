import vine from "@vinejs/vine";

// Валидатор для тела запроса при создании теста
export const creationTestValidator = vine.compile(vine.object({
    title: vine.string().trim().minLength(3),
    summary: vine.string().trim().optional(),
    group_id: vine.number().positive().min(1),
    participants: vine.array(vine.number().positive().min(1)).minLength(0),
    questions: vine.array(vine.object({
        number: vine.number().positive().min(1),
        checkbox_answers: vine.array(vine.object({
            answer: vine.any(),
            is_correct: vine.boolean(),
        })).minLength(0),
        question: vine.string().trim(),
        radio_answers: vine.array(vine.object({
            answer: vine.any(),
            is_correct: vine.boolean(),
        })).minLength(0),
        type: vine.enum(['text', 'checkbox', 'radio']),
    })).minLength(1),
}));

// Валидатор для получения списка тестов (ADMIN | TEACHER)
export const getTestsValidatorTeacher = vine.compile(vine.object({
    per_page: vine.number().positive().min(1).optional().requiredIfExists('page'),
    page: vine.number().positive().min(1).optional().requiredIfExists('per_page'),
}));

// Валидатор для получения теста по ID (STUDENT)
export const getTestByIdStudentValidator = vine.compile(vine.object({
    test_id: vine.number().positive().min(1),
}));