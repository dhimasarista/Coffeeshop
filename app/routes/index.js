const Product = require("../models/product")
function IndexRoutes(app, io) {
    app.get('/', async (req, res) => {
        try {
            res.status(200).send("Hello, World!")
        } catch (error) {
            console.error('Error fetching products:', error)
            res.status(500).send('Internal Server Error')
        }
    })
    app.get('/api/items', async (req, res) => {
        try {
            const products = await Product.getAll()
            res.status(200).json({
                products
            })
        } catch (error) {
            console.error('Error fetching products:', error)
            res.status(500).send('Internal Server Error')
        }
    })
}

module.exports = IndexRoutes