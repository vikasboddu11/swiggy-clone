const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        image: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["placed", "preparing", "out for delivery", "delivered"],
        required: true,
        default: "placed"
    }
}, { timestamps: true })

module.exports = mongoose.model("Orders", orderSchema)