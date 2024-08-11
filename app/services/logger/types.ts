
export type HttpMethods = 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';
export type ErrCodes = 'E_VALIDATION_ERROR' | 'E_NOT_FOUND_DATA' | 'E_HTTP_EXCEPTION';
export type ErrStatus = 200 | 300 | 400 | 401 | 403 | 404 | 422 | 500;
export interface ErrMessage { 
    message: string;
    [key: string]: any; 
};

export interface Err {
    code: ErrCodes;
    status: ErrStatus;
    messages: Array<ErrMessage>;
}