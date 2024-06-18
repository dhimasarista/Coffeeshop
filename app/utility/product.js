const knex = require('../config/knex')
async function getOrdersWithProducts() {
    const orders = await knex.select().from('orders').orderBy('updated_at', 'desc')
    for (let order of orders) {
        const orderItems = await knex('order_items')
            .select('products.name', 'order_items.quantity', 'products.price')
            .join('products', 'order_items.product_id', 'products.id')
            .where('order_items.order_id', order.id)
        order.products = orderItems
    }

    return orders
}

module.exports = {getOrdersWithProducts}