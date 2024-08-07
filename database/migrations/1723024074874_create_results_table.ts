import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'results';

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary();
            table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
            table.integer('test_id').unsigned().references('id').inTable('tests').onDelete('CASCADE');
            table.boolean('is_success').nullable();
            table.boolean('is_checked').defaultTo(false).notNullable();
            table.timestamp('check_date').nullable();
            table.integer('duration').unsigned().notNullable();
            table.smallint('success_count').unsigned().nullable();
            table.timestamp('created_at');
            table.timestamp('updated_at');
        });
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}