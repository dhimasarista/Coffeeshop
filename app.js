const express = require('express')
const http = require("http")
const bodyParser = require('body-parser')
const path = require('path')
const cron = require('cron')
const expressLayouts = require("express-ejs-layouts")
const socketIo = require("socket.io")
const cors = require("cors")

const IndexRoutes = require('./app/routes')
const OrderRoutes = require('./app/routes/order')
const { getOrdersWithProducts } = require("./app/utility/product")
const checkPaymentStatus = require('./app/utility/checkPaymentStatus')

const app = express()
const server = http.createServer(app)
const io = socketIo(server)
const port = 3000

// Middleware
app.set("layout", path.join(__dirname, "views/layouts/main"))
app.set('view engine', 'ejs')
app.set("views", path.join(__dirname, "views"))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('wwwroot'))
app.use(expressLayouts)
app.use(cors())

// Routes
IndexRoutes(app, io)
OrderRoutes(app, io)

const cancelOrderJob = new cron.CronJob('0 */1 * * * *', async function() {
    await checkPaymentStatus(io)
}, null, true, 'Asia/Jakarta')
cancelOrderJob.start() // Start cron job

// Socket.IO handling
io.on('connection', (socket) => {
    socket.emit('orders', getOrdersWithProducts())
    // socket.on('alert', () => {
    //     console.log('Received alert event from client')
    //     // Lakukan tindakan sesuai kebutuhan
    //     socket.emit('alert', 'This is an alert from the server')
    // })

    // Handle disconnect
    socket.on('disconnect', () => {})
})

// Start server
server.listen(port, () => {
    console.clear()
    console.log(`Server is running on http://localhost:${port}`)
})
