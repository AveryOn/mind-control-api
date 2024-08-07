import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import Result from '#models/result';
import Question from '#models/question';

export default class Answer extends BaseModel {
    @column({ isPrimary: true })
    declare id: number;

    @column()
    declare resultId: number;

    @column()
    declare questionId: number;

    @column()
    declare answer: string | string[];

    @column()
    declare isCorrect: boolean | null;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;

    // RELATIONS
    @belongsTo(() => Result)
    declare result: BelongsTo<typeof Result>;

    @belongsTo(() => Question)
    declare question: BelongsTo<typeof Question>;
}