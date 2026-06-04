import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from './axiosInstance'

function UserProductsByRestaurent() {

  const [products, setProducts] = useState([])
  const [name, setName] = useState("")
  const {restaurentId} = useParams()

  const navigate = useNavigate()
  
  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get(`/api/product/${restaurentId}`)
      console.log(res)
      setProducts(res.data.products)
      setName(res.data.restaurentName)
    }
    fetchProducts()
  },[restaurentId])

  const handleDelete = async (e,productId) => {
    e.stopPropagation()
    try {
        await axios.delete(`/api/product/${productId}`, {
            headers: {
                authorization: token
            }
        })
        const newProducts = await products.filter((product) => product._id !== productId)
        setProducts(newProducts)
    } catch (error) {
        console.log(error)
    }
  }

  const handleUpdate = async(e, productId) => {
    e.stopPropagation()
    navigate(`/updateProduct/${productId}`)
  }

  return (
    <div className="p-6 pt-24">
      <h2 className="text-2xl font-bold mb-6 text-center" >Welcome to {name}</h2>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      {
        products.map((product) => {
          return(
            <div key={product._id} className="bg-white shadow rounded-lg cursor-pointer relative">

              {/* ✅ Wrapper added ONLY for positioning buttons */}
              <div className="relative">
                <img 
                  src={`${import.meta.env.VITE_API_URL}/${product.image}`} 
                  alt={product.productName}
                  className="w-full h-[180px] object-cover rounded-t-lg"
                />

                {/* ✏️ EDIT BUTTON */}
                <button
                  className="absolute top-2 left-2 bg-white rounded-full w-9 h-9 flex items-center justify-center shadow-md hover:bg-blue-500 hover:text-white transition"
                  onClick={(e) => handleUpdate(e, product._id)}
                >
                  ✏️
                </button>

                {/* 🗑️ DELETE BUTTON */}
                <button
                  className="absolute bottom-2 right-2 bg-white rounded-full w-9 h-9 flex items-center justify-center shadow-md hover:bg-red-500 hover:text-white transition"
                  onClick={(e) => handleDelete(e, product._id)}
                >
                  🗑️
                </button>
              </div>

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

      <button
        onClick={() => navigate(`/add-product/${restaurentId}`)}
        className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:bg-orange-600 transition duration-300"
      >
        ADD PRODUCT
      </button>
    </div>
  )
}

export default UserProductsByRestaurent