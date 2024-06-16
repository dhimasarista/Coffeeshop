const knex = require('../config/knex')

// Helper function untuk mendapatkan orders dengan detail produk
async function getOrdersWithProducts() {
    const orders = await knex.select().from('orders').orderBy('updated_at', 'desc')

    // Ambil order_items untuk setiap order
    for (let order of orders) {
        const orderItems = await knex('order_items')
            .select('products.name', 'order_items.quantity', 'products.price')
            .join('products', 'order_items.product_id', 'products.id')
            .where('order_items.order_id', order.id);

        // Tambahkan orderItems ke dalam order untuk ditampilkan di views
        order.products = orderItems;
    }

    return orders;
}

module.exports = {getOrdersWithProducts}