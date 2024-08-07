import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm';
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations';
import User from '#models/user';
import Answer from '#models/answer';
import Test from '#models/test';

export default class Result extends BaseModel {
    @column({ isPrimary: true })
    declare id: number;

    @column()
    declare userId: number;

    @column()
    declare testId: number;

    @column()
    declare isSuccess: boolean | null;

    @column()
    declare isChecked: boolean;

    @column()
    declare checkDate: DateTime | null;

    @column()
    declare duration: number;

    @column()
    declare successCount: number | null;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;

    // RELATIONS
    @belongsTo(() => User)
    declare user: BelongsTo<typeof User>;

    @belongsTo(() => Test)
    declare test: BelongsTo<typeof Test>

    @hasMany(() => Answer)
    declare answers: HasMany<typeof Answer>;
}