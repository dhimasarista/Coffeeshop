const Product = require("../models/product")
function IndexRoutes(app, io) {
    app.get('/', async (req, res) => {
        try {
            const products = await Product.getAll()
            res.render('index', { products })
        } catch (error) {
            console.error('Error fetching products:', error)
            res.status(500).send('Internal Server Error')
        }
    })
}

module.exports = IndexRoutes