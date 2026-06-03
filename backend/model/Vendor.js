const mongoose = require('mongoose')

const VendorSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    restaurent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurent"
    }]
})

const Vendor = mongoose.model("Vendor", VendorSchema)

module.exports = Vendor