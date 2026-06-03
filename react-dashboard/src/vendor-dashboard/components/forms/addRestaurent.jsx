import React, { useState } from 'react'
import axios from '../axiosInstance'
import { useNavigate } from 'react-router-dom'


function AddRestaurent() {

  const [restaurentName, setRestaurentName] = useState("")
  const [area, setArea] = useState("")
  const [category, setCategory] = useState([])
  const [region, setRegion] = useState([])
  const [offer, setOffer] = useState("")
  const [image, setImage] = useState("")
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const handleCategoryChange = (e) => {
    const value = e.target.value
    setCategory((prev) => prev.includes(value)? prev.filter((item) => item !== value): [...prev, value])
  }

  const handleRegionChange = (e) => {
    const value = e.target.value
    setRegion((prev) => prev.includes(value)? prev.filter((item) => item !== value): [...prev, value])
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    const token = localStorage.getItem("token")

    try {
      const formData = new FormData()

      formData.append("restaurentName", restaurentName)
      formData.append("area", area)
      formData.append("category", JSON.stringify(category))
      formData.append("region", JSON.stringify(region))
      formData.append("offer", offer)
      formData.append("image", image)

      const res = await axios.post("api/restaurent/add-restaurent", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token
        }
      })
        console.log(res)
        const restaurent = res.data.savedRestaurent
        const restaurentId = restaurent._id
        alert(res.data.message)
        navigate(`/add-product/${restaurentId}`)
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.error || "Something went wrong")
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 w-[650px]">
        
        <h3 className="text-2xl font-bold mb-6 text-orange-500 text-center">
          Add Restaurant
        </h3>

        {
          error && <p className='text-red-600 items-center text-sm'>{error}</p>
        }

        <div className="grid grid-cols-2 gap-4">


          <div>
            <label className="block mb-1 font-medium">Restaurant Name</label>
            <input 
              type="text"
              placeholder="Enter restaurant name"
              value={restaurentName}
              onChange={(e) => setRestaurentName(e.target.value)}
              className="w-full border p-2 rounded-md outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Area</label>
            <input 
              type="text"
              placeholder="Enter area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full border p-2 rounded-md outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Offer</label>
            <input 
              type="text"
              placeholder="Enter offer"
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
              className="w-full border p-2 rounded-md outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Restaurant Image</label>
            <input 
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full border p-2 rounded-md bg-white cursor-pointer file:mr-2 file:px-3 file:py-1 file:bg-orange-500 file:text-white file:border-0 file:rounded hover:file:bg-orange-600"
            />
          </div>

        </div>

        <div className="mt-5">
          <h3 className="text-lg font-semibold mb-2">Category</h3>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" value = "veg" onChange={handleCategoryChange} />
              Veg
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" value = "Non-veg" onChange={handleCategoryChange} />
              Non-Veg
            </label>
          </div>
        </div>

        <div className="mt-5">
          <h3 className="text-lg font-semibold mb-2">Region</h3>
          <div className="grid grid-cols-2 gap-3">
            {
              ["North Indian", "South Indian", "Chinese", "Bakery"].map((item) => (
                <label key={item} className="flex items-center gap-2 cursor-pointer" >
                   <input type="checkbox" value={item} onChange={handleRegionChange} />{item}</label>
              ))
            }
          </div>
        </div>

        <button type='submit' className="w-full bg-orange-500 text-white py-2 rounded-md mt-6 hover:bg-orange-600 transition">
          Add Restaurant
        </button>

      </form>

    </div>
  )
}

export default AddRestaurent