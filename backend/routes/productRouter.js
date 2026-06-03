const express = require('express')
const router = express.Router()
const { addProduct, getProductByRestaurent, deleteProductById, updateProductById, getProductById, getAllProducts } = require('../controller/productController')
const verifyToken = require('../middleware/verifyToken')
const path = require('path')

router.get("/getAllProducts", getAllProducts)

router.post("/add-product/:restaurentId", verifyToken, addProduct)
router.get('/:restaurentId', getProductByRestaurent)
router.delete('/:productId', verifyToken, deleteProductById)
router.put('/updateProductById/:productId', verifyToken, updateProductById)
router.get('/getProduct/:productId', getProductById)

router.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName
    res.sendFile(path.join(__dirname, '..', 'uploads', imageName))
})

module.exports = router