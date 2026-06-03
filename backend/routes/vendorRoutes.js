const express = require("express")
const router = express.Router()
const { registerVendor, loginVendor, getAllVendors, getVendorById } = require('../controller/vendorController')

router.post('/register', registerVendor)
router.post('/login', loginVendor)

router.get('/all-vendors', getAllVendors)
router.get('/single-vendor/:id', getVendorById)

module.exports = router