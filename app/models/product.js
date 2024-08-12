const knex = require('../config/knex')


class Product {
    constructor(name, price){
        this.name = name
        this.price = price
    }


    static async getAll(){
        try {
            const products = await knex('products').select('*'); // Memilih semua kolom dari tabel 'products'
            return products;
        } catch (error) {
            throw new Error(`Error getting products: ${error.message}`);
        }
    }
}

module.exports = Product