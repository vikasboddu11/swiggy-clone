import React, { useEffect, useState } from 'react'
import axios from './axiosInstance'

function Orders() {

  const [orders, setOrders] = useState([])

  const token = localStorage.getItem("token")

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/order/getOrders', {
        headers: {
          authorization: token
        }
      })
      setOrders(res.data)
      console.log(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <div className="p-6 pt-24 bg-gray-50 min-h-screen">

      <h2 className="text-2xl font-bold mb-6">
        Your Orders 📦
      </h2>

      {
        orders.length === 0 ? (
          <p className="text-gray-500">No orders yet</p>
        ) : (
          <div className="flex flex-col gap-6">

            {
              orders.map((order) => {
                return (
                  <div key={order._id} className="bg-white shadow-md rounded-xl p-4">

                    {/* 🔹 Order Header */}
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-sm text-gray-500">
                        Order ID: {order._id.slice(-6)}
                      </p>

                      <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full font-medium capitalize">
                        {order.status}
                      </span>
                    </div>

                    {/* 🔹 Items */}
                    <div className="flex flex-col gap-4">

                      {
                        order.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">

                            {/* LEFT SIDE (IMAGE + NAME) */}
                            <div className="flex items-center gap-3">

                              <img
                                src={`${import.meta.env.VITE_API_URL}/${item.image}`}
                                alt={item.name}
                                className="w-14 h-14 rounded-lg object-cover border"
                              />

                              <div>
                                <p className="font-medium text-gray-800">
                                  {item.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Quantity: {item.quantity}
                                </p>
                              </div>

                            </div>

                            {/* RIGHT SIDE (PRICE) */}
                            <p className="font-semibold text-gray-700">
                              ₹{item.price * item.quantity}
                            </p>

                          </div>
                        ))
                      }

                    </div>

                    {/* 🔹 Total */}
                    <div className="mt-4 border-t pt-3 flex justify-between items-center font-semibold">
                      <span>Total</span>
                      <span className="text-green-600">
                        ₹{order.totalAmount}
                      </span>
                    </div>

                  </div>
                )
              })
            }

          </div>
        )
      }

    </div>
  )
}

export default Orders