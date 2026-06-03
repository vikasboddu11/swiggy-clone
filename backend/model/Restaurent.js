const mongoose = require("mongoose")

const restaurentSchema = new mongoose.Schema({
    restaurentName: {
        type: String,
        required: true,
        unique: true
    },
    area: {
        type: String,
        required: true
    },
    category: {
        type: [{
            type: String,
            enum: ["Non-veg", "veg"]
        }]
    },
    region: {
        type: [{
            type: String,
            enum: ["North Indian", "South Indian", "Chinese", "Bakery"]
        }]
    },
    offer: {
        type: String
    },
    image: {
        type: String
    },
    vendor: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor"
    }],
    product: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products"
    }]

})

const Restaurent = mongoose.model("Restaurent", restaurentSchema)

module.exports = Restaurent