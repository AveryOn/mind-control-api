import { HttpContext } from '@adonisjs/core/http';
import chalk from 'chalk';
import moment from 'moment';
import type { ErrCodes, HttpMethods, Err } from './types.js';

// Форматирование и сборка частей лога ошибки для контроллера
function bundleControllerErrorMsg(errCode: string, path: string, controllerName: string, HttpMethod: HttpMethods, targetMethod: string) {
    try {
        const methodsColor = { POST: '#ed6b2a', GET: '#a0ce65', PUT: '#9363c6', DELETE: '#bf4e50', PATCH: '#5f4ebf' };
        let separator: string = chalk.bold.white(` : `);
        let HttpMethodChunck: string = chalk.bold.hex(methodsColor[HttpMethod])(`[${HttpMethod}]`);
        let timeChunck: string = chalk.bold.redBright(`[${moment(Date.now()).utcOffset('+03:00').format('HH:mm:ss')}]`);
        let errorHeader: string = chalk.hex('#f24a41')(`[${controllerName}.${targetMethod}]${separator}[ERROR => ${errCode}]`);
        let pathDescriptior: string = chalk.hex('#5c9e40')(`path: "${path}"`);
        return { timeChunck, errorHeader, pathDescriptior, HttpMethodChunck, separator }
    } catch (err) {
        console.error(chalk.red('[META ERROR]:[bundleControllerErrorMsg] => '), err);
    }
}

// Формирование лога для работы контроллера

function bundleControllerLog(HttpMethod: HttpMethods, controllerName: string, targetMethod: string, HttpUrl: string, sep?: string) {
    try {
        const methodsColor = { POST: '#ed6b2a', GET: '#a0ce65', PUT: '#9363c6', DELETE: '#bf4e50', PATCH: '#5f4ebf' };
        let separator: string = chalk.bold.white(`${sep ?? ':'}`);
        let timeChunck: string = chalk.bold.blueBright(`[${moment(Date.now()).utcOffset('+03:00').format('HH:mm:ss')}]`);
        let HttpMethodChunck: string = chalk.bold.hex(methodsColor[HttpMethod])(`[${HttpMethod}]`);
        let logHeader: string = chalk.hex('#4f8cb5')(`${HttpMethodChunck}${separator}[${controllerName}.${targetMethod}]`);
        let HttpUrlChunk: string = chalk.hex('#c9b582')(`${HttpUrl}`);
        return { timeChunck, logHeader, HttpUrlChunk, separator }
    } catch (err) {
        console.error(chalk.red('[META ERROR]:[bundleControllerLog] => '), err);
    }
}
// Сервис логгирования для контроллеров
export function controllerLogger(path: string, ) {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
        const controllerMethod = descriptor.value;
    
        descriptor.value = async function ({...ctx}: HttpContext) {
            try {
                const result = await controllerMethod.apply(this, [{...ctx}]);
                const bundleLog = bundleControllerLog(ctx.request.method() as any, this.constructor.name, key, ctx.request.url(), ' :: ');
                console.log(`${bundleLog?.timeChunck}${bundleLog?.separator}${bundleLog?.logHeader}${bundleLog?.separator}${bundleLog?.HttpUrlChunk}`);
                return result;
            } catch (err) {
                const ctxErr = err as Err;
                // Ошибка валидации
                const bundle = bundleControllerErrorMsg(ctxErr.code, path, this.constructor.name, ctx.request.method() as any, key);
                console.log(`${bundle?.timeChunck}${bundle?.separator}${bundle?.HttpMethodChunck}${bundle?.separator}${bundle?.errorHeader}${bundle?.separator}${bundle?.pathDescriptior}`);
                if(ctxErr.code === 'E_VALIDATION_ERROR' as ErrCodes) {
                    return ctx.response.abort({ meta: { status: ctxErr.status, url: ctx.request.url() }, data: ctxErr.messages }, ctxErr.status);
                } 
                // Другие ошибки
                ctx.response.abort({ meta: { status: ctxErr.status, url: ctx.request.url() }, data: ctxErr.messages }, ctxErr.status);
            }
        };
        return descriptor;
    }
}
  