import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm';
import type { HasMany } from '@adonisjs/lucid/types/relations';
import Test from '#models/test';


export default class Group extends BaseModel {
    @column({ isPrimary: true })
    declare id: number;

    @column()
    declare title: string;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;

    // Relationship
    @hasMany(() => Test)
    declare tests: HasMany<typeof Test>;
}