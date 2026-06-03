const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: [{
            type: String,
            enum: ["veg", "Non-veg"]
        }]
    },
    image: {
        type: String
    },
    bestSeller: {
        type: Boolean
    },
    description: {
        type: String
    },
    restaurent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurent'
    }
})

const Products = mongoose.model("Product", productSchema)

module.exports = Products