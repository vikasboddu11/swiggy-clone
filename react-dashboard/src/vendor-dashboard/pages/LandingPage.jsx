import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Login from '../components/forms/vendorLogin'
import Register from '../components/forms/vendorRegister'
import AddRestaurent from '../components/forms/addRestaurent'
import AddProducts from '../components/forms/addProducts'
import AllProducts from '../components/AllProducts'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProductsByRestaurent from '../components/ProductsByRestaurent'
import Profile from '../components/Profile'
import UpdateRestaurent from '../components/forms/UpdateRestaurent'
import UserProductsByRestaurent from '../components/UserProductsByRestaurent'
import UpdateProduct from '../components/forms/UpdateProduct'
import Cart from '../components/Cart'
import OrderSuccess from '../components/OrderSuccess'
import Orders from '../components/Orders'

function LandingPage() {

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user")
    return storedUser? JSON.parse(storedUser): null
  })

  return (
    <div>

      <div>
        <Navbar user = {user}/>
      </div>

      <Routes>
        <Route path='/login' element= {user? <Navigate to= '/' /> : <Login setUser = {setUser}/> } />
        <Route path='/register' element = {user? <Navigate to= '/' />: <Register/>} />
        <Route path='/add-restaurent' element = {user? <AddRestaurent/>: <Navigate to='/login'/>} />
        <Route path='/add-product/:restaurentId' element = {user? <AddProducts/>: <Navigate to= '/login' />} />
        <Route path='/' element = {<AllProducts/>} />
        <Route path='/product/:restaurentId' element={<ProductsByRestaurent user={user} />} />
        <Route path='/profile/:vendorId' element = {user? <Profile user = {user} />: <Navigate to= '/login' /> } />
        <Route path='/updateRestaurent/:restaurentId' element = {<UpdateRestaurent/>}/>
        <Route path='/product/UserProductsByRestaurent/:restaurentId' element = {<UserProductsByRestaurent/>} />
        <Route path='/updateProduct/:productId' element = {<UpdateProduct/>} />
        <Route path='/cart' element = {<Cart/>} />
        <Route path='/orderSuccess' element = {<OrderSuccess/>}/>
        <Route path='/orders' element = {<Orders/>} />
      </Routes>
    </div>
  )
}

export default LandingPage