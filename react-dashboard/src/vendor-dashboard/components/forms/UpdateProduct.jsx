import React, { useEffect, useState } from 'react'
import axios from '../axiosInstance'
import { useParams, useNavigate } from 'react-router-dom'

function UpdateProduct() {

  const [productName, setProductName] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState([])
  const [image, setImage] = useState(null)
  const [bestSeller, setBestSeller] = useState(true)
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const{productId} = useParams()

  const handleCategoryChange = (e) => {
    const value = e.target.value
    setCategory((prev) => prev.includes(value)? prev.filter((item) => item !== value): [...prev, value])
  }

  useEffect(() => {
    const fetchProduct = async() => {
    try {
      if(!productId) return
      const res = await axios.get(`/api/product/getProduct/${productId}`)
      const data = res.data
      if(data){
        setProductName(data.productName)
        setPrice(data.price)
        setCategory(data.category || [])
        setBestSeller(data.bestSeller)
        setDescription(data.description)
      }
    }catch (error) {
      console.log(error)
    }
  }
    fetchProduct()
  },[productId])

  const handleSubmit = async(e) => {
    e.preventDefault()
    const token = localStorage.getItem("token")
    try {
      const formData = new FormData()

      formData.append("productName", productName)
      formData.append("price", price)
      formData.append("category", JSON.stringify(category))
      formData.append("bestSeller", JSON.stringify(bestSeller))
      formData.append("description", description)

      if(image){
        formData.append("image", image)
      }

      const res = await axios.put(`/api/product/updateProductById/${productId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: token
        }
      })
      alert(res.data.message)
      navigate(`/profile/${JSON.parse(localStorage.getItem("user"))._id}`)
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.error || "Something went wrong")
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-30 0 30">
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 w-[650px]">
        
        <h3 className="text-2xl font-bold mb-6 text-orange-500 text-center">
          Add Product
        </h3>

        {
          error && <p className='text-red-600 items-center text-sm'>{error}</p>
        }

        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className="block mb-1 font-medium">Product Name</label>
            <input 
              type="text"
              placeholder="Enter product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full border p-2 rounded-md outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Price</label>
            <input 
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border p-2 rounded-md outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Product Image</label>
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
              <input type="checkbox" value = "veg" checked = {category.includes("veg")} onChange={handleCategoryChange} />
              Veg
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" value = "Non-veg" checked = {category.includes("Non-veg")} onChange={handleCategoryChange} />
              Non-Veg
            </label>
          </div>
        </div>

        <div className="mt-5">
          <h3 className="text-lg font-semibold mb-2">Best Seller</h3>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="bestseller" onChange={() => setBestSeller(true)} checked = {bestSeller === true}  />
              Yes
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="bestseller" onChange={() => setBestSeller(false)} checked = {bestSeller === false}  />
              No
            </label>
          </div>
        </div>

        <div className="mt-5">
          <label className="block mb-1 font-medium">Description</label>
          <textarea 
            placeholder="Enter description"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded-md outline-none focus:ring-2 focus:ring-orange-400"
          ></textarea>
        </div>

        <button type='submit' className="w-full bg-orange-500 text-white py-2 rounded-md mt-6 hover:bg-orange-600 transition">
          Update Product
        </button>

      </form>

    </div>
  )
}

export default UpdateProduct