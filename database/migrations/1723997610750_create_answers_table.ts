import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'answers';

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary();
            table.integer('result_id').unsigned().references('id').inTable('results');
            table.integer('question_id').unsigned().references('id').inTable('questions').onDelete('CASCADE');
            table.json('answer').notNullable();
            table.boolean('is_correct').nullable();
            table.timestamp('created_at');
            table.timestamp('updated_at');
        });
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}