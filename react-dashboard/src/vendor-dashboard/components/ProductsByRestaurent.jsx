import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from './axiosInstance'

function ProductsByRestaurent() {

  const [products, setProducts] = useState([])
  const [name, setName] = useState("")
  const [showCartBtn, setShowCartBtn] = useState(false)
  const navigate = useNavigate()
  const {restaurentId} = useParams()

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get(`/api/product/${restaurentId}`)
      console.log(res)
      setProducts(res.data.products)
      setName(res.data.restaurentName)
    }
    fetchProducts()
  },[restaurentId])

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem("token")
    try {
      const res = await axios.post('/api/cart/addToCart', { productId }, {
        headers: {
          authorization: token
        }
      })

      console.log(res)

      setShowCartBtn(true)

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="p-6 pt-24">
      <h2 className="flex items-center justify-center text-2xl font-bold mb-6 " >Welcome to {name}</h2>
      {
        showCartBtn && (
          <button
            onClick={() => navigate('/cart')}
            className="fixed top-27 right-6 z-50 bg-green-600 text-white px-5 py-2 rounded-full shadow-lg hover:bg-green-700 transition"
          >
            🛒 Go to Cart
          </button>
        )
      }
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      {
        products.map((product) => {
          return(
            <div key={product._id} className="bg-white shadow rounded-lg">

              <img 
                src={`${import.meta.env.VITE_API_URL}/${product.image}`} 
              alt={product.productName}
              className="w-full h-[180px] object-cover rounded-t-lg"
              onClick={() => handleAddToCart(product._id)}
               />

              <div className="p-3">
                <h3 className="font-semibold">{product.productName}</h3>
                <p className="text-sm text-gray-500">₹ {product.price}</p>
                <p className="text-sm text-gray-500">{product.category?.join(', ')}</p>
              </div>
              
            </div>
          )
        })
      }
      </div>
    </div>
  )
}

export default ProductsByRestaurent