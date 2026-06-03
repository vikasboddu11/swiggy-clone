import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function OrderSuccess() {

  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/orders')
    }, 4000) // 4 seconds

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">

      {/* ✅ Success Circle */}
      <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center shadow-lg animate-bounce">
        <span className="text-green-600 text-4xl">✔</span>
      </div>

      {/* ✅ Heading */}
      <h1 className="text-2xl font-bold mt-6 text-gray-800">
        Order Placed Successfully!
      </h1>

      {/* ✅ Subtext */}
      <p className="text-gray-500 mt-2 text-center max-w-sm">
        Your delicious food is being prepared 🍽️  
        Sit back and relax...
      </p>

      {/* ✅ Loading dots animation */}
      <div className="flex gap-2 mt-6">
        <span className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-green-600 rounded-full animate-bounce delay-150"></span>
        <span className="w-2 h-2 bg-green-600 rounded-full animate-bounce delay-300"></span>
      </div>

    </div>
  )
}

export default OrderSuccess