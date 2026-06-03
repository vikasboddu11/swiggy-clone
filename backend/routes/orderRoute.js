const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/verifyToken')
const { placeOrder, getOrders } = require('../controller/orderController')

router.post('/placeOrder', verifyToken, placeOrder)
router.get('/getOrders', verifyToken, getOrders)

module.exports = router