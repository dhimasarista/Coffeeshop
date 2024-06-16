// migrations/<timestamp>_create_orders_table.js
const { v7: uuidv7 } = require('uuid');

exports.up = function(knex) {
    return knex.schema.createTable('orders', function(table) {
        table.uuid('id').primary().defaultTo(knex.raw('UUID()')); // Generate UUID manually
        table.string('status').notNullable().defaultTo('pending'); // Default status pending
        table.integer('total_amount').notNullable();
        table.string('transaction_token').notNullable();
        table.timestamps(true, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('orders');
};
