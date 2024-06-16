const knex = require('../config/knex')
const axios = require('axios');
const { base64encode } = require('nodejs-base64');
const { getOrdersWithProducts } = require('./product');
async function checkPaymentStatus(io) {  
    try {
        const ordersToUpdate = await knex('orders').where("status", "pending")
        // Loop melalui setiap pesanan dan ubah status menjadi cancel
        for (const order of ordersToUpdate) {
            const midtransResponse = await axios.get(`https://api.sandbox.midtrans.com/v2/${order.id}/status`, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Basic ${base64encode("SB-Mid-server-zTZ2r8AhWDPPeBo7H8bWtssm:")}`, // Replace with your Midtrans server key
                }
            });
            const status = midtransResponse.data.transaction_status
            if (!status && ((new Date() - new Date(order.created_at)) / (1000 * 60)) > 2) {
                await knex('orders')
                    .update('status', 'cancel')
                    .where('id', order.id)
            }
            if (status === "cancel" || status === "expire") {
                await knex('orders')
                    .update('status', 'cancel')
                    .where('id', order.id)
            } else if (status === "settlement") {
                await knex('orders')
                    .update('status', 'success')
                    .where('id', order.id);
            }
            io.emit('orders', await getOrdersWithProducts())
        }
    } catch (error) {
        console.error('Error while updating orders:', error);
    }
}

module.exports = checkPaymentStatus