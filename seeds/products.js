// seeds/<timestamp>_seed_products.js
const { v4: uuidv4 } = require('uuid');

exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('products').del()
        .then(function () {
            // Inserts seed entries
            return knex('products').insert([
                { id: uuidv4(), name: 'Kopi Susu', price: 15000 },
                { id: uuidv4(), name: 'Vanilla Latte', price: 18000 },
                { id: uuidv4(), name: 'Americano', price: 20000 },
                { id: uuidv4(), name: 'Cappucino', price: 22000 }
            ]);
        });
};
