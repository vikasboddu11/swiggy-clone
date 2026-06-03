const multer = require('multer')
const path = require('path')
const Vendor = require('../model/Vendor')
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

const addRestaurent = async(req, res) => {
    try {
        let { restaurentName, area, category, region, offer } = req.body
        if (!restaurentName || !area) {
            return res.status(400).json({ error: "Please fill all the fileds" })
        }
        const existingRestaurent = await Restaurent.findOne({ restaurentName })
        if (existingRestaurent) {
            return res.status(409).json({ error: "Restaurent already registered" })
        }
        try {
            category = JSON.parse(category)
            region = JSON.parse(region)
        } catch (err) {
            return res.status(400).json({ error: "Invalid category or region format" })
        }
        const image = req.file ? req.file.filename : undefined
        const vendor = await Vendor.findById(req.vendorId)
        if (!vendor) {
            return res.status(401).json({ error: "Vendor not found" })
        }
        const newRestaurent = new Restaurent({
            restaurentName,
            area,
            category,
            region,
            offer,
            image,
            vendor: vendor._id
        })

        const savedRestaurent = await newRestaurent.save()
        vendor.restaurent.push(savedRestaurent)
        const restaurentId = savedRestaurent._id
        const restaurent_Name = savedRestaurent.restaurentName
        await vendor.save()
        res.status(200).json({ message: "Restaurent added successfully", restaurentId, restaurent_Name, savedRestaurent })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server error" })
    }
}

const getAllRestaurents = async(req, res) => {
    try {
        const restaurents = await Restaurent.find()
        if (!restaurents.length === 0) {
            return res.status(404).json({ message: "No restaurents yet" })
        }
        res.status(200).json(restaurents)
    } catch (error) {
        console.log(error)
        res.status(500).json({ erro: "Something went wrong" })
    }
}

const getRestaurentByVendorId = async(req, res) => {
    const vendorId = req.params.vendorId
    try {
        const vendor = await Vendor.findById(vendorId)
        if (!vendor) {
            return res.status(404).json({ error: "Invalid vendor Id" })
        }
        if (vendor._id.toString() !== vendorId.toString()) {
            return res.status(404).json({ error: "Anotharized to access" })
        }
        const restaurents = await Restaurent.find({ vendor: vendorId })
        if (restaurents.length === 0) {
            return res.status(404).json({ message: "No restaurents yet" })
        }
        res.status(200).json(restaurents)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server error" })
    }
}

const deleteRestaurentById = async(req, res) => {
    const restaurentId = req.params.restaurentId
    try {
        const restaurent = await Restaurent.findById(restaurentId)
        if (!restaurent) {
            return res.status(404).json({ error: "Restaurent not found" })
        }

        if (restaurent.vendor.toString() !== req.vendorId.toString()) {
            return res.status(403).json({ error: "Your not authorized for this operation." })
        }
        const vendor = await Vendor.findById(restaurent.vendor)
        await Product.deleteMany({ restaurent: restaurentId })
        await Restaurent.findByIdAndDelete(restaurentId)
        vendor.restaurent = vendor.restaurent.filter((id) => id.toString() !== restaurentId)
        await vendor.save()
        res.status(200).json({ message: "Restaurent and its products deleted successfully" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server error" })
    }
}

const updateRestaurentById = async(req, res) => {
    const restaurentId = req.params.restaurentId
    const { restaurentName, area, category, region, offer } = req.body
    try {
        const restaurent = await Restaurent.findById(restaurentId)
        if (!restaurent) {
            return res.status(404).json({ error: "Restaurent not found" })
        }
        if (restaurent.vendor.toString() !== req.vendorId.toString()) {
            return res.status(403).json({ error: "Not authorized" })
        }
        if (restaurentName) restaurent.restaurentName = restaurentName
        if (area) restaurent.area = area
        if (category) restaurent.category = JSON.parse(category)
        if (region) restaurent.region = JSON.parse(region)
        if (req.file) {
            restaurent.image = req.file.filename
        }

        await restaurent.save()

        res.status(200).json({
            message: "Restaurent updated successfully",
            updatedRestaurent: restaurent
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server error" })
    }
}

const getRestaurentById = async(req, res) => {
    const restaurentId = req.params.restaurentId
    try {
        const restaurent = await Restaurent.findById(restaurentId)
        if (!restaurent) {
            return res.status(404).json({ error: "Restaurent not found" })
        }
        res.status(200).json(restaurent)
    } catch (error) {
        res.status(500).json({ error: "Server error" })
    }
}

module.exports = { addRestaurent: [uploads.single('image'), addRestaurent], deleteRestaurentById, getAllRestaurents, getRestaurentByVendorId, updateRestaurentById: [uploads.single('image'), updateRestaurentById], getRestaurentById }