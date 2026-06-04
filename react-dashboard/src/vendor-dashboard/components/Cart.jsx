import React, { useEffect, useState } from 'react'
import axios from './axiosInstance'
import { useNavigate } from 'react-router-dom'

function Cart() {

  const [carts, setCarts] = useState([])
  const [action, setAction] = useState("")

  const navigate = useNavigate()

  const token = localStorage.getItem('token')

  const fetchProducts = async() => {
    try {
      const res = await axios.get('/api/cart/getCart', {
        headers: {
          authorization: token
        }
      })
      setCarts(res.data.items)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if(token){
      fetchProducts()
    }
  }, [])

  const hanldeUpdateProduct = async(e, productId, action) => {
    e.preventDefault()
    try {
      await axios.patch('/api/cart/update', {productId, action}, {
        headers: {
          authorization: token
        }
      })
      fetchProducts()
    } catch (error) {
      console.log(error)
    }
  }

  const handleRemoveProduct = async (e, productId) => {
    e.preventDefault()
    try {
      await axios.delete(`/api/cart/remove/${productId}`, {
        headers: {
          authorization: token
        }
      })
      fetchProducts()
    } catch (error) {
      console.log(error)
    }
  }

  // const totalPrice = carts.reduce((acc, item) => {
  //   return acc + (item.product?.price) * item.quantity
  // },0)

  // console.log(totalPrice)

  const handleOrder = async(e) => {
    e.preventDefault()
    try {
      const res = await axios.post('/api/order/placeOrder', {}, {
        headers: {
          authorization: token
        }
      })
      console.log(res)
      setCarts([])
      navigate('/orderSuccess')
    } catch (error) {
      console.log(error)
    }
  }

  console.log(carts)

  return (
    <div className="p-6 pt-24">
      
      <h2 className="text-xl font-bold mb-6">
        Your Cart Items 🛒
      </h2>

      {
        carts.length === 0 ? (
          <p className="text-gray-500">Your cart is empty</p>
        ) : (
          <div className="flex flex-col gap-4">
            {
              carts.map((item) => {
                return(
                  <div 
                    key={item._id}
                    className="flex items-center justify-between bg-white rounded-lg shadow p-4"
                  >

                    <div className="w-[120px] h-[100px] flex-shrink-0">
                      <img 
                        src={`${import.meta.env.VITE_API_URL}/${item.product?.image}`} 
                        alt={item.product?.productName} 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex-1 px-4">
                      <h3 className="font-semibold text-lg">
                        {item.product?.productName}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {item.product?.description || "No description available"}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        {item.product?.category?.join(', ')}
                      </p>

                      <p className="text-md font-semibold mt-2">
                        ₹{item.product?.price}
                      </p>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-2">

                      <span className="text-green-600 font-semibold text-sm">
                        Quantity
                      </span>

                      <div className="flex items-center gap-3 border px-3 py-1 rounded">

                        <button className="text-lg font-bold px-2 hover:text-red-500" 
                        onClick={(e) => hanldeUpdateProduct(e, item.product?._id, "decrease")}
                        >
                          -
                        </button>

                        <span className="text-md font-semibold">
                          {item.quantity}
                        </span>

                        <button className="text-lg font-bold px-2 hover:text-green-600"
                        onClick={(e) => hanldeUpdateProduct(e, item.product?._id, "increase")}
                        >
                          +
                        </button>

                      </div>
                      <button className="bg-red-600 text-white px-8 py-3 rounded-full shadow-md 
                      hover:bg-red-400 active:scale-95 transition-all duration-200 font-semibold text-md"
                      onClick={(e) => handleRemoveProduct(e, item.product?._id)}
                      >
                        Remove item
                        </button>

                    </div>

                  </div>
                )
              })
            }
          </div>
        )
      }

      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <button className="bg-green-600 text-white px-8 py-3 rounded-full shadow-lg 
        hover:bg-green-700 active:scale-95 transition-all duration-200 font-semibold text-lg"
        onClick={(e) => handleOrder(e)}
        >
          🧾 Place Order
        </button>
      </div>

    </div>
  )
}

export default Cart