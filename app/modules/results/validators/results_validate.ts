import vine from "@vinejs/vine";

// Валидатор для проверки полей при создании нового результата
export const resultCreationValidator = vine.compile(vine.object({
    test_id: vine.number().positive().min(1),
    duration: vine.number().positive().min(0),
    answers: vine.array(vine.object({
        answer: vine.string().trim(),
        questionId: vine.number().positive().min(1),
    })),
}))