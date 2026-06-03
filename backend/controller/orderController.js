const Order = require('../model/order')
const Cart = require('../model/cart')

const placeOrder = async(req, res) => {
    try {

        const vendorId = req.vendorId

        const cart = await Cart.findOne({ vendor: vendorId }).populate("items.product")

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: "Cart is empty" })
        }
        const orderItems = cart.items.map((item) => {
            console.log("FULL PRODUCT:", item.product)
            return {
                product: item.product._id,
                image: item.product.image,
                name: item.product.productName,
                price: item.product.price,
                quantity: item.quantity
            }
        })

        const totalAmount = orderItems.reduce((acc, item) => {
            return acc + item.price * item.quantity
        }, 0)

        const newOrder = new Order({
            vendor: vendorId,
            items: orderItems,
            totalAmount: totalAmount
        })

        await newOrder.save()

        cart.items = []

        await cart.save()

        res.status(201).json({ message: "Order placed successfully", newOrder })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server error" })
    }
}

const getOrders = async(req, res) => {
    try {
        const vendorId = req.vendorId
        const orders = await Order.find({ vendor: vendorId }).sort({ createdAt: -1 })
        if (!orders || orders.length === 0) {
            return res.status(400).json({ error: "You havent added anything tilnow" })
        }
        res.status(200).json(orders)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server error" })
    }
}

module.exports = { placeOrder, getOrders }