export type ErrStatus = 200 | 300 | 400 | 401 | 403 | 404 | 422 | 500;
export type HttpMethods = 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';
export type ErrCodes = 'E_VALIDATION_ERROR' | 'E_NOT_FOUND_DATA' | 'E_HTTP_EXCEPTION' | 'E_FORBIDDEN' | 'E_INTERNAL' | 'E_DATABASE_EXCEPTION';

// Общий объект пагинатора
export interface Paginator {
    total?: number;
    perPage?: number;
    currentPage?: number;
    lastPage?: number | null;
    firstPage?: number | null;
    hasPrev?: boolean;
    hasNext?: boolean;
}
// Тело ответа после выполнения любого контроллера
export interface ResponseData {
    meta: {
        status: ErrStatus;
        url: string;
        paginator?: Paginator | null;
    };
    data: { [key: string]: any } | any[] | null;
}