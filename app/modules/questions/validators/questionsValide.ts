import vine from "@vinejs/vine";

// Валидатор для получения списка вопросов конкретного теста
export const getListQuestionsValidation = vine.compile(vine.object({
    test_id: vine.number().positive().min(1),
}));