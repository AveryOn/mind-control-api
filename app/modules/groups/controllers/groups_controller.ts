import { HttpContext } from "@adonisjs/core/http";
import { controllerLogger } from "#services/logger/logger_service";
// ### TYPES
import { Err } from "#services/logger/types";
import { ResponseData } from "#types/http_types";
import User from "#models/user";
import { groupCreationValidator } from "../validators/groups_validate.js";
import { ReqestBodyCreationGroup, ResponseDataGroup } from "../types/groups_types.js";
import GroupsService from "../services/groups_service.js";

export default class GroupsController {
    // Создание новой группы
    @controllerLogger(import.meta.url)
    async store({ request, response, auth }: HttpContext) {
        //########### Проверка аутентификации ##########
        const user: User = await auth.authenticate();
        // Если контроллер выполнился для пользователя с ролью "student" то ошибка 403. Доступ к этому контроллеру есть только у админа и учителя 
        if(user.role === 'student') throw { code: "E_FORBIDDEN", status: 403, messages: [ { message: 'Не достаточно прав на выполнение запроса' } ] } as Err;
        if(user.role === 'admin' || user.role === 'teacher') {
            // Проверка / валидация полей запроса
            const rawBody = request.only(['title']);
            const valideData: ReqestBodyCreationGroup = await groupCreationValidator.validate(rawBody);
            // Создание новой группы в базе данных
            const readyGroupData: ResponseDataGroup = await GroupsService.createNewGroup(valideData)
            response.send({ meta: { status: 200, url: request.url(), paginator: null }, data: { group: readyGroupData } } as ResponseData);
        }
    }

    // Получение списка групп с БД
    @controllerLogger(import.meta.url)
    async index({ request, response, auth }: HttpContext) {
        //########### Проверка аутентификации ##########
        await auth.authenticate();
        // Извлечение списка групп из БД
        const readyGroupsData: ResponseDataGroup[] = await GroupsService.getGroups();
        response.send({ meta: { status: 200, url: request.url(), paginator: null }, data: { groups: readyGroupsData } } as ResponseData);
    }
}