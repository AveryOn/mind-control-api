import { ErrStatus, ErrCodes } from '#types/http_types';
 
export interface ErrMessage { 
    message: string;
    [key: string]: any; 
};

export interface Err {
    code: ErrCodes;
    status: ErrStatus;
    messages: Array<ErrMessage>;
}