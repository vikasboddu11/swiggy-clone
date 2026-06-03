const Vendor = require("../model/Vendor")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()

const secretkey = process.env.JWT_SECRET_KEY

const registerVendor = async(req, res) => {
    const { userName, email, password } = req.body

    try {
        if (!userName || !email || !password) {
            return res.status(400).json({ message: "Plaease fill all the fields" })
        }
        const existingEmail = await Vendor.findOne({ email })
        if (existingEmail) {
            return res.status(409).json({ message: "User already registered" })
        }
        const hashedPassword = await bcrypt.hash(password, 12)
        const newVendor = new Vendor({
            userName,
            email,
            password: hashedPassword
        })
        await newVendor.save()
        res.status(201).json({ message: "Vendor registered successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server errro" })
    }
}

const loginVendor = async(req, res) => {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" })
        }
        const vendor = await Vendor.findOne({ email })
        if (!vendor) {
            return res.status(404).json({ message: "Email does not exists, try to login" })
        }
        const isMatch = await bcrypt.compare(password, vendor.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" })
        }
        const token = jwt.sign({ vendorId: vendor._id }, secretkey, { expiresIn: "1h" })
        const vendorId = vendor._id
        res.status(200).json({ message: "login successful", token, vendorId, vendor })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server errro" })
    }
}

const getAllVendors = async(req, res) => {
    try {
        const vendors = await Vendor.find().populate("restaurent")
        if (!vendors) {
            return res.status(404).json({ error: "No vendors" })
        }
        res.status(201).json({ vendors })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server error" })
    }
}

const getVendorById = async(req, res) => {
    const vendorId = req.params.id
    try {
        const vendor = await Vendor.findById(vendorId).populate("restaurent")
        if (!vendor) {
            return res.status(404).json({ error: "vendor not found" })
        }
        res.status(200).json({ vendor, vendorId })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server error" })
    }
}

// const deleteVendorById = async(req, res) => {
//     try {
//         const vendorId = req.params.vendorId
//         const vendor = await Vendor.findById(vendorId)
//         if (!vendor) {
//             return res.statuS(404).json({ error: "Vendor not found" })
//         }
//         if (vendorId.toString() !== req.vendorId.toString()) {
//             return res.statuS(403).json({ error: "Your anauthorized for this operation" })
//         }
//         await Vendor.findByIdAndDelete(vendorId)

//     } catch (error) {

//     }
// }

module.exports = { registerVendor, loginVendor, getAllVendors, getVendorById }