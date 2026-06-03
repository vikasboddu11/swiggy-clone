import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from './axiosInstance'

function Profile({ user }) {

  const [restaurents, setRestaurents] = useState([])

  const navigate = useNavigate()

  const token = localStorage.getItem("token")

  const { vendorId } = useParams()

  useEffect(() => {
    const fetchRestaurents = async () => {
      try {
        const res = await axios.get(`/api/restaurent/getRestaurentsByVendorId/${vendorId}`, {
          headers: {
            authorization: token
          }
        })
        console.log(res)
        setRestaurents(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchRestaurents()
  }, [vendorId])

  const handleAddRestaurent = (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }
    navigate('/add-restaurent')
  }

  const handleAddProduct = (e, restaurentId) => {
    e.stopPropagation()
    navigate(`/add-product/${restaurentId}`)
  }

  const handleDelete = async(e, restaurentId) => {
    e.stopPropagation()
    try {
      await axios.delete(`/api/restaurent/${restaurentId}`, {
        headers: {
          authorization: token
        }
      })
      const newRestaurents = restaurents.filter((item) => item._id !== restaurentId)
      setRestaurents(newRestaurents)
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdate = async(e, restaurentId) => {
    e.stopPropagation()
    navigate(`/updateRestaurent/${restaurentId}`)
  }

  return (
    <div className="p-6">
      <h1 className='text-2xl font-bold text-center text-orange-500 w-full mb-6 mt-27'>
        {user?.userName?.toUpperCase()}'S PROFILE
      </h1>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {
          restaurents.map((hotel) => {
            return (
              <div
                key={hotel._id}
                className="bg-white rounded-lg shadow cursor-pointer hover:scale-105 transition relative"
                onClick={() => navigate(`/product/UserProductsByRestaurent/${hotel._id}`)}
              >

                <div className="relative">
                  <img
                    src={`http://localhost:3000/api/uploads/${hotel.image}`}
                    alt={hotel.restaurentName}
                    className="w-full h-[180px] object-cover rounded-t-lg"
                  />

                  <button
                    onClick={(e) => handleAddProduct(e, hotel._id)}
                    className="absolute top-2 right-2 bg-white rounded-full w-9 h-9 flex items-center justify-center shadow-md text-lg font-bold hover:bg-orange-500 hover:text-white transition"
                  >
                    +
                  </button>
                </div>

                <div className='p-3'>
                  <h2 className='font-semibold'>{hotel.restaurentName}</h2>
                  <p className='text-sm text-gray-500'>{hotel.area}</p>
                  <p className='text-sm text-gray-500'>
                    {hotel.category?.join(', ')}
                  </p>
                </div>
                  <button
                    onClick={(e) => handleUpdate(e, hotel._id)}
                    className="absolute top-2 left-2 bg-white rounded-full w-9 h-9 flex items-center justify-center shadow-md hover:bg-blue-500 hover:text-white transition"
                  >
                      ✏️
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, hotel._id)}
                    className="absolute bottom-2 right-2 bg-white rounded-full w-9 h-9 flex items-center justify-center shadow-md hover:bg-red-500 hover:text-white transition"
                  >
                    🗑️
                  </button>

              </div>
            )
          })
        }
      </div>

      <button
        onClick={handleAddRestaurent}
        className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:bg-orange-600 transition duration-300"
      >
        ADD RESTAURENT
      </button>
    </div>
  )
}

export default Profile