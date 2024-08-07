import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'tests';

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary();
            table.string('title').notNullable();
            table.text('summary').nullable();
            table.integer('group_id').unsigned().references('groups.id').nullable();
            table.smallint('questions_count').unsigned().notNullable();
            table.timestamp('created_at');
            table.timestamp('updated_at');
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}