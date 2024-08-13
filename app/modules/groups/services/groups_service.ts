import Group from "#models/group";
import db from "@adonisjs/lucid/services/db";
import { ReqestBodyCreationGroup, ResponseDataGroup } from "../types/groups_types.js";
import { Err } from "#services/logger/types";


export default class GroupsService {

    // Создание новой группы тестов в системе
    static async createNewGroup(data: ReqestBodyCreationGroup): Promise<ResponseDataGroup> {
        return new Promise((resolve, reject) => { 
            db.transaction(async (trx) => { 
                try {
                    const newGroup: Group = await Group.create({...data}, { client: trx });
                    resolve(newGroup.toJSON() as ResponseDataGroup);
                } catch (err) {
                    console.error('modules/groups/services/groups_service.ts: [GroupsService]:createNewGroup => ', err);
                    reject({ code: "E_INTERNAL", status: 500, messages: [{message: 'Внутрення ошибка сервера'}] } as Err);
                }
            });
        });
    }

    // Получение списка групп с базы данных
    static async getGroups(): Promise<ResponseDataGroup[]> {
        return new Promise((resolve, reject) => { 
            db.transaction(async (trx) => { 
                try {
                    let groups: Group[] | ResponseDataGroup[] = await Group.query({ client: trx }).select('*');
                    groups = groups.map((group) => group.toJSON() as ResponseDataGroup);
                    resolve(groups);
                } catch (err) {
                    console.error('modules/groups/services/groups_service.ts: [GroupsService]:getGroups => ', err);
                    reject({ code: "E_INTERNAL", status: 500, messages: [{message: 'Внутрення ошибка сервера'}] } as Err);
                }
            });
        });
    }
}