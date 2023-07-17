import {useContext, useState} from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import { Navigate } from 'react-router'
import {Rings} from "react-loading-icons"
import { UserContext } from '../context/UserContext'
function AddProductPage() {
  const {userInfo, isAuth} = useContext(UserContext)
  const [errors, setErrors] = useState([])
  const [newProduct, setNewProduct] = useState({
    name:"",
    category:"Travel",
    price: 0,
    description: "",
    image: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const handleChange = (event) => {
    if (event.target.name === "name" && event.target.value.length < 7){
      if (!errors.includes(1)){
        setErrors([...errors, 1])
      }
    } else if ( event.target.name === "name" && event.target.value.length >= 7) {
      const updatedErrors = errors.filter(error => {
        return error !== 1
      })
      console.log(updatedErrors)
      setErrors(updatedErrors)
    }

    if (event.target.name === "description" && event.target.value.length < 30){
      if (!errors.includes(2)){
        setErrors([...errors, 2])
      }
    } else if ( event.target.name === "description" && event.target.value.length >= 30) {
      const updatedErrors = errors.filter(error => {
        return error !== 2
      })
      console.log(updatedErrors)
      setErrors(updatedErrors)

      console.log(errors.length)
    }
    setNewProduct({...newProduct, [event.target.name]: event.target.value})
  }

  const handlePhoto = (event) => {
    console.log(event.target.files)
    setNewProduct({...newProduct, image: event.target.files[0]})
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!errors.length > 0){
      setIsLoading(true)
      const formData = new FormData()

      formData.append("image", newProduct.image)
      formData.append("name", newProduct.name)
      formData.append("description", newProduct.description)
      formData.append("price", newProduct.price)
      formData.append("category", newProduct.category)

      fetch("http://localhost:8080/add-product", {
        method: "POST",
        headers:{
          "Authorization": "Bearer " + userInfo.token
        },
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        window.location.href = `http://localhost:5173/product/${data.product._id}`;
      })
    }

  }

  return (
    <div>
      <Header/>
      <Navbar/>
      {!isAuth && <Navigate to="/"/>}
      <div className="add-edit-product-container login-info">

      <form className="add-edit-form"onSubmit={handleSubmit} encType="multipart/form-data">
        <label>Name</label>
        <input type="text" onChange={handleChange} name="name"/>
        {errors.includes(1) && <p style={{color: "red"}}>The name must be longer than 6 characters</p>}
        <label>Description</label>
        <textarea onChange={handleChange} name="description"/>
        {errors.includes(2) && <p style={{color: "red"}}>The description must be longer than 29 characters</p>}
        <label>Price</label>
        <input type="number" onChange={handleChange} min={0} name="price"/>
        <label>Category</label>
        <select  onChange={handleChange} name="category">
          <option value="Travel">Travel</option>
          <option value="Sport">Sport</option>
          <option value="Wellness">Wellness</option>
          <option value="Cosmetics">Cosmetics</option>
          <option value="Technology">Technology</option>
        </select>
        <input onChange={handlePhoto} type="file" name="file"/>
        <button>{isLoading ? <Rings/>:"Add a product"}</button>
      </form>
      </div>
    </div>
  )
}

export default AddProductPage
