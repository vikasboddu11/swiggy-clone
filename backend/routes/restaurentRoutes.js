const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/verifyToken')
const { addRestaurent, deleteRestaurentById, getAllRestaurents, getRestaurentByVendorId, updateRestaurentById, getRestaurentById } = require('../controller/restaurentController')
const path = require('path')

router.post('/add-restaurent', verifyToken, addRestaurent)
router.get('/getAllRestaurents', getAllRestaurents)
router.delete('/:restaurentId', verifyToken, deleteRestaurentById)
router.get('/getRestaurentsByVendorId/:vendorId', verifyToken, getRestaurentByVendorId)
router.put('/updateRestaurentById/:restaurentId', verifyToken, updateRestaurentById)
router.get('/getRestaurentById/:restaurentId', getRestaurentById)

router.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName
    res.sendFile(path.join(__dirname, '..', 'uploads', imageName))
})

module.exports = router