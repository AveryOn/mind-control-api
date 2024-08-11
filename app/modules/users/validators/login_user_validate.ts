import vine from "@vinejs/vine";

export const loginUserValidate = vine.compile(vine.object({
    login: vine.string().trim().minLength(3),
    password: vine.string().trim().minLength(6),
}));