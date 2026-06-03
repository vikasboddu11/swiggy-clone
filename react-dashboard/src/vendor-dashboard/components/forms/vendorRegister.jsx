import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../axiosInstance'

function VendorLogin() {

  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const handleSubmit = async(e) => {
    e.preventDefault()
    try {
      const res = await axios.post("/api/vendor/register", {
        userName,
        email,
        password
      })
      alert(res.data.message)
      navigate('/login')
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.message || "Something went wrong")
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      
      <div className="bg-white shadow-md rounded-lg p-8 w-80">
        
        <h2 className="text-2xl font-bold mb-6 text-center text-orange-500">
          Vendor Register
        </h2>

        {error && (<p className="text-red-600 text-sm text-center ">{error}</p>)}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input 
            type="text" 
            placeholder="Enter your user name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="border p-2 rounded-md outline-none focus:ring-2 focus:ring-orange-400"
          />
          
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="border p-2 rounded-md outline-none focus:ring-2 focus:ring-orange-400"
          />

          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Enter your password"
            className="border p-2 rounded-md outline-none focus:ring-2 focus:ring-orange-400"
          />

          <button 
            type="submit"
            className="bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition"
          >
            Register
          </button>

        </form>

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link className="text-red-600 hover:underline" to="/login">
            Login
          </Link>
        </p>

      </div>

    </div>
  )
}

export default VendorLogin