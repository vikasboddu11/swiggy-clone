import React, { useEffect, useState } from 'react'
import axios from './axiosInstance'
import { useNavigate } from 'react-router-dom'

function AllProducts() {

  const [restaurents, setRestaurents] = useState([])
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [activeFilter, setActiveFilter] = useState("All")

  const [showCartBtn, setShowCartBtn] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchAllRestaurents = async() => {
      try {
        const res = await axios.get('/api/restaurent/getAllRestaurents')
        setRestaurents(res.data)
      } catch (error) {
        console.log(error)
      }
    } 
    fetchAllRestaurents()
  },[])

  useEffect(() => {
    const fetchProducts = async() => {
      try {
        const res = await axios.get('/api/product/getAllProducts')
        setProducts(res.data)
        setFilteredProducts(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchProducts()
  },[])

  const handleFilters = (type) => {
    setActiveFilter(type)
    if(type === "All"){
      setFilteredProducts(products)
    }else{
      const filteredData = products.filter((product) => product.category?.includes(type))
      setFilteredProducts(filteredData)
    }
  }

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
    <div className="p-6 pt-24 relative">

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

      <h2 className="text-xl font-bold mb-4">Restaurents in Hyderabad</h2>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {
          restaurents.map((item) => {
            return(
              <div 
                key={item._id} 
                onClick={() => navigate(`/product/${item._id}`)} 
                className="min-w-[220px] bg-white rounded-lg shadow cursor-pointer hover:scale-105 transition overflow-hidden"
              >

                <img
                  src={`${import.meta.env.VITE_API_URL}/${item.image}`}
                  alt={item.restaurentName}
                  className="w-[220px] h-[150px] object-cover rounded-t-lg"
                />

                <div className="p-3">
                  <h3 className="font-semibold">
                    {item.restaurentName}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {item.area}
                  </p>
                </div>
              </div>
            )
          })
        }
      </div>

      <h2 className="text-xl font-bold mt-6 mb-4">
         Items with online delivery
      </h2>

      <div className='w-full flex flex-wrap gap-3 mb-6'>
        {
          ["All", "veg", "Non-veg"].map((type) => {
            return(
              <button 
                key={type} 
                onClick={() => handleFilters(type)}
                className={`px-4 py-2 border rounded whitespace-nowrap
                ${activeFilter === type ? "bg-blue-600 text-white" : ""}
                `}
              >
                {type}
              </button>
            )
          })
        }
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {
          filteredProducts.map((item) => {
            return(
              <div 
                key={item._id} 
                onClick={() => handleAddToCart(item._id)}
                className="bg-white rounded-lg shadow cursor-pointer hover:scale-105 transition"
              >

                <img 
                  src={`${import.meta.env.VITE_API_URL}/${item.image}`} 
                  alt={item.productName} 
                  className="w-full h-[180px] object-cover rounded-t-lg"
                />

                <div className="p-3">
                  <h3 className="font-semibold">
                    {item.productName}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {item.category?.join(', ')}
                  </p>

                  <p className="text-sm text-gray-500">
                    ₹{item.price}
                  </p>
                </div>
                
              </div>
            )
          })
        }
      </div>

    </div>
  )
}

export default AllProducts