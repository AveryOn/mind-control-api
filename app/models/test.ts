import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, belongsTo, manyToMany } from '@adonisjs/lucid/orm';
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Group from '#models/group';
import User from '#models/user';
import Question from '#models/question';
import Result from '#models/result';

export default class Test extends BaseModel {
    @column({ isPrimary: true })
    declare id: number;

    @column()
    declare title: string;

    @column()
    declare summary: string;

    @column()
    declare groupId?: number | null;

    @column()
    declare questionsCount: number;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;

    // RELATIONS

    @manyToMany(() => User, { pivotTable: 'user_tests' })
    declare users: ManyToMany<typeof User>;

    @belongsTo(() => Group)
    declare group: BelongsTo<typeof Group>;

    @hasMany(() => Result)
    declare results: HasMany<typeof Result>;

    @hasMany(() => Question)
    declare questions: HasMany<typeof Question>;
}