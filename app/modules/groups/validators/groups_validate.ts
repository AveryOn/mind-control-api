import vine from "@vinejs/vine";

// Валидация тела запроса при создании новой группы
export const groupCreationValidator = vine.compile(vine.object({
    title: vine.string().trim().minLength(3),
}));