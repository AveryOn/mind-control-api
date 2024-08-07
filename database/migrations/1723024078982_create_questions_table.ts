import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'questions';

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary();
            table.integer('test_id').unsigned().references('id').inTable('tests');
            table.smallint('number').unsigned().notNullable();
            table.text('question').notNullable();
            table.enu('type', ['text', 'checkbox', 'radio']).notNullable();
            table.json('radio_answers').nullable();
            table.json('checkbox_answers').nullable();
            table.timestamp('created_at');
            table.timestamp('updated_at');
        })
    }

    async down() {
        this.schema.dropTable(this.tableName);
    }
}