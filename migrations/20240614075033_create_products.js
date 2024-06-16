// migrations/<timestamp>_create_products_table.js
const { v7: uuidv7 } = require('uuid');

exports.up = function(knex) {
    return knex.schema.createTable('products', function(table) {
        table.uuid('id').defaultTo(knex.raw('UUID()')).primary();
        table.string('name').notNullable();
        table.integer('price').notNullable(); // Price in IDR without decimals
        table.timestamps(true, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('products');
};
