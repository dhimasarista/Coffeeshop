// migrations/<timestamp>_create_order_items_table.js

exports.up = function(knex) {
    return knex.schema.createTable('order_items', function(table) {
        table.uuid('id').primary().defaultTo(knex.raw('UUID()')); // Generate UUID manually
        table.uuid('order_id').references('id').inTable('orders').onDelete('CASCADE'); // Foreign key to orders table
        table.uuid('product_id').references('id').inTable('products'); // Foreign key to products table
        table.integer('quantity').notNullable();
        table.integer('amount').notNullable();
        table.string('status').notNullable().defaultTo('pending'); // Status for each item
        table.timestamps(true, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('order_items');
};
