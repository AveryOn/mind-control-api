
// Данные приходящие с клиента для создания новой учетной записи пользователя
export interface UserCretionData {
    name: string;
    login: string;
    password: string;
}

// Данные пользователя приходящие с клиента для входа в систему
export interface UserLoginData {
    login: string;
    password: string;
}

// Роль в системе
export type Role = 'admin' | 'teacher' | 'student';

// Тип данных пользователя, которые отправляются на клиент
export interface UserForClient {
    id: number;
    name: string;
    login: string;
    role: Role;
    createdAt: string;
    updatedAt: string;
}

export interface TokenForClient {
    type: "bearer";
    name: string | null;
    token: string;
    abilities: Array<string>;
    lastUsedAt: string;
    expiresAt: string;
}

// Данные которые уходят на клиент после успешной авторизации в системе
export interface ResultLoginUserData {
    user: UserForClient,
    token: TokenForClient,
}