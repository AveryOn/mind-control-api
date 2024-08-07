import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'user_tests';

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary();
            table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
            table.integer('test_id').unsigned().references('id').inTable('tests').onDelete('CASCADE');
            table.unique(['user_id', 'test_id']);
            table.timestamp('created_at');
            table.timestamp('updated_at');
        });
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}