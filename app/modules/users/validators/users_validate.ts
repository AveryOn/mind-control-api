import vine from "@vinejs/vine";

// Валидация параметров запроса/путей при получении списка пользователей
export const usersFetchParamsValidate = vine.compile(vine.object({
    per_page: vine.number().positive().min(1).optional().requiredIfExists('page'),
    page: vine.number().positive().min(1).optional().requiredIfExists('per_page'),
}))