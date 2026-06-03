const jwt = require('jsonwebtoken')
const Vendor = require('../model/Vendor')
const dotenv = require('dotenv').config()

const secretKey = process.env.JWT_SECRET_KEY

const verifyToken = async(req, res, next) => {
    const token = req.headers.authorization
    if (!token) {
        return res.status(401).json({ error: "Token is required" })
    }
    try {
        const decoded = jwt.verify(token, secretKey)
        const vendor = await Vendor.findById(decoded.vendorId)
        if (!vendor) {
            return res.status(401).json({ error: "Vendor not found" })
        }
        req.vendorId = vendor._id
        next()
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expired" })
        }
        console.log(error)
        return res.status(401).json({ error: "Invalid token" })
    }
}

module.exports = verifyToken