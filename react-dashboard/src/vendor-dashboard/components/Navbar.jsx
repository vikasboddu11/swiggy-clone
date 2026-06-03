import React from 'react'
import { useNavigate } from 'react-router-dom'

function Navbar({user}) {

  const navigate = useNavigate()

  const vendorId = user?._id

  const handleProfile = (e) => {
    e.preventDefault()
    console.log(vendorId)
    navigate(`/profile/${vendorId}`)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  return (
    <div className='w-full bg-white text-black shadow-md mb-2.5 fixed z-50 '>
        <div className='max-w-7xl mx-auto flex justify-between items-center px-6 py-6'>
            <div className='text-xl font-bold text-orange-500 cursor-pointer'>
            <button className='cursor-pointer' onClick={() => navigate('/')}>FOOD DELIVERY</button>
            </div>
            {
              user? (
            <div className='flex items-center gap-4'>
              <button 
                onClick={handleProfile}
                className="text-lg font-semibold px-4 py-1 border border-orange-500 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition duration-300 cursor-pointer"
              >
                {user.userName.toUpperCase()}
              </button>

              <button 
                onClick={() => navigate('/cart')} 
                className="text-lg font-semibold px-4 py-1 border rounded-full hover:bg-gray-500 hover:text-white transition duration-300 cursor-pointer"
              >
                Cart🛒
              </button>

              <button 
                onClick={() => navigate('/orders')} 
                className="text-lg font-semibold px-4 py-1 border rounded-full hover:bg-gray-500 hover:text-white transition duration-300 cursor-pointer"
              >
                Orders 📦
              </button>

              <button 
                onClick={handleLogout} 
                className="text-lg font-semibold px-4 py-1 border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition duration-300 cursor-pointer"
              >
                Logout
              </button>

            </div>
              ):<div className='text-lg font-semibold px-4 py-1 border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition duration-300 cursor-pointer'>
                  <button className='cursor-pointer' onClick={() => navigate('/login')}>LOGIN</button>
                </div>
            }
        </div>
    </div>
  )
}

export default Navbar