import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'answers';

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.json('answer').notNullable();
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('answer').notNullable();
    });
  }
}