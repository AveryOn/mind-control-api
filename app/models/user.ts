import { DateTime } from 'luxon';
import hash from '@adonisjs/core/services/hash';
import { compose } from '@adonisjs/core/helpers';
import { BaseModel, column, manyToMany, hasMany } from '@adonisjs/lucid/orm';
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid';
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens';
import type { ManyToMany, HasMany } from '@adonisjs/lucid/types/relations';
import Test from '#models/test';
import Result from '#models/result';

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
    uids: ['login'],
    passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
    @column({ isPrimary: true })
    declare id: number;

    @column()
    declare name: string;

    @column()
    declare login: string;

    @column()
    declare role: 'admin' | 'teacher' | 'student';

    @column({ serializeAs: null })
    declare password: string;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime | null;

    static accessTokens = DbAccessTokensProvider.forModel(User);

    // RELATIONS
    // TESTS
    @manyToMany(() => Test, { pivotTable: 'user_tests' })
    declare tests: ManyToMany<typeof Test>;

    // RESULTS
    @hasMany(() => Result)
    declare results: HasMany<typeof Result>;
}
