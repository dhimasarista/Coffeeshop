const snap = require('../config/midtrans')
const { v7: uuidv7 } = require('uuid')
const knex = require('../config/knex')
const { getOrdersWithProducts } = require("../utility/product")

function OrderRoutes(app, io) {
    app.get('/orders/pay/:id', async (req, res) => {
        try {
            const id = req.params.id
            const result = await knex("orders").update("status", "success").where("id", id)
            io.emit('orders', await getOrdersWithProducts())
            return res.json({status: 200, message: result})
        } catch (error) {
            return res.json({ status: 500, message: error})
        }
    })

    app.get("/orders/cancel/:id", async (req, res) => {
        try {
            const id = req.params.id
            const result = await knex("orders").update("status", "cancel").where("id", id)
            io.emit('orders', await getOrdersWithProducts())
            return res.json({status: 200, message: result})
        } catch (error) {
            return res.json({ status: 500, message: error})
        }
    })

    app.post("/orders/show", (req, res) => {
        try {
            io.emit('alert', { transactionToken: req.body.token, orderId: req.body.orderId })
            return res.json({status: 200, message: "success"})
        } catch (error) {
            return res.json({ status: 500, message: error})
        }
    })

    app.get("/orders/list", async (req, res) => {
        try {
            const orders = await getOrdersWithProducts()

            return res.json({status : 200, data : orders})
        } catch (error) {
            console.error('Error fetching orders:', error)
            res.status(500).send('Internal Server Error')
        }
    })

    app.get('/orders', async (req, res) => {
        try {
            const orders = await getOrdersWithProducts()

            res.render('orders', { orders })
        } catch (error) {
            console.error('Error fetching orders:', error)
            res.status(500).send('Internal Server Error')
        }
    })


    app.post('/orders', async (req, res) => {
        const { products } = req.body
        try {
            let totalAmount = 0
            const orderItems = []

            for (let item of products) {
                const product = await knex('products').where('id', item.productId).first()
                if (!product) {
                    throw new Error(`Product with ID ${item.productId} not found`)
                }
                const amount = product.price * item.quantity
                totalAmount += amount

                orderItems.push({
                    product_id: item.productId,
                    quantity: item.quantity,
                    amount: product.price,
                    status: 'pending'
                })
            }

            const orderId = uuidv7()
            for (let orderItem of orderItems) {
                orderItem.order_id = orderId
            }

            const transactionDetails = {
                transaction_details: {
                    order_id: orderId,
                    gross_amount: totalAmount
                },
                item_details: orderItems.map(item => ({
                    id: item.product_id,
                    price: item.amount,
                    quantity: item.quantity,
                    name: `Product ID ${item.product_id}`
                }))
            }

            const transactionToken = await snap.createTransaction(transactionDetails)

            await knex('orders').insert({
                id: orderId,
                status: 'pending',
                total_amount: totalAmount,
                transaction_token: transactionToken.token
            })
            await knex('order_items').insert(orderItems)
            res.json({ status: 200, orderId, totalAmount, transactionToken:transactionToken.token })
            io.emit('orders', await getOrdersWithProducts())
        } catch (error) {
            console.error('Error creating order:', error)
            res.status(500).json({ message: 'Internal Server Error' })
        }
    })
}

module.exports = OrderRoutes