const multer = require('multer')
const path = require('path')
const Restaurent = require('../model/Restaurent')
const Product = require('../model/Product')


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const uploads = multer({ storage: storage })

const addProduct = async(req, res) => {
    try {
        let { productName, price, category, bestSeller, description } = req.body
        const image = req.file ? req.file.filename : undefined
        const restaurentId = req.params.restaurentId
        const restaurent = await Restaurent.findById(restaurentId)
        if (!restaurent) {
            return res.status(404).json({ error: "Restaurent is missing" })
        }
        if (restaurent.vendor.toString() !== req.vendorId.toString()) {
            return res.status(403).json({ error: "Unautharized: Not your restaurent" })
        }
        try {
            category = JSON.parse(category)
        } catch (error) {
            return res.status(400).json({ error: "Invalid category format" })
        }
        const newProduct = new Product({
            productName,
            price,
            category,
            bestSeller,
            description,
            image,
            restaurent: restaurent._id
        })

        const savedProduct = await newProduct.save()
        restaurent.product.push(savedProduct._id)
        await restaurent.save()
        res.status(201).json({ message: "product added successfully", product: savedProduct })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server error" })
    }
}

const getAllProducts = async(req, res) => {
    try {
        const products = await Product.find()
            // if (products.length === 0) {
            //     return res.status(404).json({ error: "No Products yet." })
            // }
        res.status(200).json(products)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server error" })
    }
}

const getProductByRestaurent = async(req, res) => {
    const restaurentId = req.params.restaurentId
    try {
        const restaurent = await Restaurent.findById(restaurentId)
        if (!restaurent) {
            return res.status(404).json({ error: "Restaurent not found" })
        }
        const products = await Product.find({ restaurent: restaurentId })
        res.status(200).json({
            restaurentName: restaurent.restaurentName,
            products
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server error" })
    }
}

const deleteProductById = async(req, res) => {
    const productId = req.params.productId
    try {
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({ error: "Product not found" })
        }
        const restaurentId = product.restaurent
        const restaurent = await Restaurent.findById(restaurentId)
        if (restaurent.vendor.toString() !== req.vendorId.toString()) {
            return res.status(403).json({ error: "Your not authorized for this operation" })
        }
        await Product.findByIdAndDelete(productId)
        restaurent.product = restaurent.product.filter((id) => id.toString() !== productId)
        await restaurent.save()
        res.status(200).json({ message: "Product deleted successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server error" })
    }
}

const updateProductById = async(req, res) => {
    const productId = req.params.productId
    const { productName, price, category, bestSeller, description } = req.body
    try {
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({ error: "Product not found" })
        }
        const restaurentId = product.restaurent
        const restaurent = await Restaurent.findById(restaurentId)
        if (restaurent.vendor.toString() !== req.vendorId.toString()) {
            return res.status(403).json({ error: "Unauthorized for this ooperation" })
        }
        if (productName) product.productName = productName
        if (price) product.price = price
        if (category) product.category = JSON.parse(category)
        if (bestSeller !== undefined) product.bestSeller = bestSeller
        if (description) product.description = description

        if (req.file) {
            product.image = req.file.filename
        }

        await product.save()
        res.status(200).json({
            message: "Product updated successfully",
            updatedProduct: product
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server error" })
    }
}

const getProductById = async(req, res) => {
    const productId = req.params.productId
    try {
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({ error: "Product not found" })
        }
        res.status(200).json(product)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server error" })
    }
}

module.exports = { addProduct: [uploads.single("image"), addProduct], getProductByRestaurent, deleteProductById, updateProductById: [uploads.single("image"), updateProductById], getProductById, getAllProducts }