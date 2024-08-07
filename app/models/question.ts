import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm';
import Test from '#models/test';
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations';
import Answer from '#models/answer';

export default class Question extends BaseModel {
    @column({ isPrimary: true })
    declare id: number;

    @column()
    declare testId: number;

    @column()
    declare number: number;

    @column()
    declare question: string;

    @column()
    declare type: 'text' | 'checkbox' | 'radio';

    @column()
    declare radioAnswers: string | null;

    @column()
    declare checkboxAnswers: string | null;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;

    // RELATIONS

    @belongsTo(() => Test)
    declare test: BelongsTo<typeof Test>;

    @hasMany(() => Answer)
    declare answers: HasMany<typeof Answer>;
}