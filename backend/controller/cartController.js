const Cart = require('../model/cart')
const Product = require('../model/Product')

const addToCart = async(req, res) => {
    try {
        const vendorId = req.vendorId
        const { productId } = req.body

        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({ error: "Product not found" })
        }

        let cart = await Cart.findOne({ vendor: vendorId })
        if (!cart) {
            cart = new Cart({
                vendor: vendorId,
                items: [{ product: productId, quantity: 1 }]
            })
        } else {
            const existingProduct = cart.items.find((item) => item.product.toString() === productId.toString())
            if (existingProduct) {
                existingProduct.quantity += 1
            } else {
                cart.items.push({ product: productId, quantity: 1 })
            }
        }
        await cart.save()
        res.status(201).json({ message: "Product added to cart successfully", cart: cart })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server error" })
    }
}

const getCarts = async(req, res) => {
    try {
        const vendorId = req.vendorId
        const products = await Cart.findOne({ vendor: vendorId }).populate("items.product")
        if (!products) {
            return res.status(404).json({ message: "Your cart is empty for now" })
        }
        res.status(200).json(products)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server error" })
    }
}

const updateCart = async(req, res) => {
    try {
        const vendorId = req.vendorId
        const { productId, action } = req.body
        const vendorCart = await Cart.findOne({ vendor: vendorId })
        if (!vendorCart) {
            return res.status(404).json({ error: "Cart not found" })
        }
        const item = await vendorCart.items.find((item) => item.product.toString() === productId.toString())
        if (!item) {
            return res.status(404).json({ error: "Product not found" })
        }
        if (action === "increase") {
            item.quantity += 1

        } else if (action === "decrease") {
            item.quantity -= 1

            if (item.quantity <= 0) {
                vendorCart.items = vendorCart.items.filter((item) => item.product.toString() !== productId.toString())
            }
        } else {
            return res.status(400).json({ error: "Invalid action" })
        }
        await vendorCart.save()
        res.status(200).json({ message: "cart updated", vendorCart })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server error" })
    }
}

const removeFromCart = async(req, res) => {
    try {
        const vendorId = req.vendorId
        const productId = req.params.productId
        const cart = await Cart.findOne({ vendor: vendorId })
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" })
        }
        cart.items = await cart.items.filter((item) => item.product.toString() !== productId.toString())
        await cart.save()
        res.status(200).json({ message: "Product removed from cart successfully", cart })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server error" })
    }
}

module.exports = { addToCart, getCarts, updateCart, removeFromCart }