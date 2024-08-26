
//  Объект тела запроса при создании новой группы
export type ReqestBodyCreationGroup = { title: string };

// Объект группы который необходимо вернуть на клиент
export interface ResponseDataGroup {
    id: number;
    title: string;
    createdAt: string;
    updatedAt: string;
} 