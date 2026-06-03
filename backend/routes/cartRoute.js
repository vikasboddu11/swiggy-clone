const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/verifyToken')
const { addToCart, getCarts, updateCart, removeFromCart } = require('../controller/cartController')

router.post('/addToCart', verifyToken, addToCart)
router.get('/getCart', verifyToken, getCarts)
router.patch('/update', verifyToken, updateCart)
router.delete('/remove/:productId', verifyToken, removeFromCart)

module.exports = router