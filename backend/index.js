const express = require("express")
const dotenv = require("dotenv").config()
const connectDB = require("./config/connectDB")
const vendorRoutes = require('./routes/vendorRoutes')
const addRestaurentRoute = require('./routes/restaurentRoutes')
const productRouter = require('./routes/productRouter')
const cartRouter = require('./routes/cartRoute')
const orderRouter = require('./routes/orderRoute')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

const PORT = process.env.PORT
const FRONTEND_URL = process.env.FRONTEND_URL

app.use(cors({
    origin: FRONTEND_URL
}))

connectDB()

app.use(bodyParser.json())

app.use('/api/vendor', vendorRoutes)
app.use('/api/restaurent', addRestaurentRoute)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/uploads', express.static('uploads'))

app.use("/home", (req, res) => {
    res.send("<h1>Welcome to Swiggy clone</h1>")
})

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})