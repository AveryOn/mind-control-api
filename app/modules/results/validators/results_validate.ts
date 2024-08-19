import vine from "@vinejs/vine";

// Валидатор для проверки полей при создании нового результата
export const resultCreationValidator = vine.compile(vine.object({
    test_id: vine.number().positive().min(1),
    duration: vine.number().positive().min(0),
    answers: vine.array(vine.object({
        answer: vine.string().trim(),
        questionId: vine.number().positive().min(1),
    })),
}));

// Объект данных необходимый для получения результатов теста (ADMIN | TEACHER)
export const resultsFetchValidatorTchr = vine.compile(vine.object({
    test_id: vine.number().positive().min(1),
    page: vine.number().positive().min(1).optional().requiredIfExists('per_page'),
    per_page: vine.number().positive().min(1).optional().requiredIfExists('page'),
}));

// Объект параметров необходимый для получения данных результата (ADMIN | TEACHER)
export const resultFetchValidatorTchr = vine.compile(vine.object({
    test_id: vine.number().positive().min(1),
    result_id: vine.number().positive().min(1),
}));

