import {useContext, useState, useEffect} from 'react'
import {useParams, Navigate} from "react-router-dom"
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import {Rings} from "react-loading-icons"
import { UserContext } from '../context/UserContext'
function EditProductPage() {
  const [product, setProduct] = useState({})
  const [errors, setErrors] = useState([])
  const {prodId} = useParams("prodId")
  const [productUpdated, setProductUpdated] = useState(false)
  const {userInfo} = useContext(UserContext)

  const [newProduct, setNewProduct] = useState({
    userId: "",
    name:product.name,
    category: product.category,
    price: product.price,
    description: product.description,
    image: ""
  })
  const [isAllowed, setIsAllowed] = useState(false)

  useEffect(() => {
    fetch(`https://backendshopmefy.onrender.com/product/${prodId}`)
    .then(res => res.json())
    .then(data => {
      const productInfo = data.product
      if (userInfo.userId === productInfo.userId){
        setIsAllowed(true)
      }
      console.log("productInfo", productInfo)
      setNewProduct({...newProduct, userId: productInfo.userId, name: productInfo.name, category: productInfo.category, description: productInfo.description, price: productInfo.price})
    })
  }, [prodId])
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
    setIsLoading(true)
    const formData = new FormData()

    formData.append("image", newProduct.image)
    formData.append("name", newProduct.name)
    formData.append("description", newProduct.description)
    formData.append("price", newProduct.price)
    formData.append("category", newProduct.category)

    fetch(`https://backendshopmefy.onrender.com/edit/${prodId}`, {
      method: "PATCH",
      headers:{
        "Authorization": "Bearer " + userInfo.token
      },
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      setIsLoading(false)
      setProductUpdated(true)
    })

  }

  return (
    <div>
      {productUpdated && <Navigate to={`/product/${prodId}`}/>}
      <Header/>
      <Navbar/>
      <div className="add-edit-product-container login-info">
        {isAllowed ?
        <form className="add-edit-form" onSubmit={handleSubmit} encType="multipart/form-data">
          <label>Name</label>
          <input type="text" onChange={handleChange} value={newProduct.name} name="name"/>
          {errors.includes(1) && <p style={{color: "red"}}>The name must be longer than 6 characters</p>}
          <label>Description</label>
          <textarea onChange={handleChange} value={newProduct.description} name="description"/>
          {errors.includes(2) && <p style={{color: "red"}}>The description must be longer than 29 characters</p>}
          <label>Price</label>
          <input type="number" onChange={handleChange} value={newProduct.price} min={0} name="price"/>
          <label>Category</label>
          <select value={newProduct.category} onChange={handleChange} name="category">
            <option value="Travel">Travel</option>
            <option value="Sport">Sport</option>
            <option value="Wellness">Wellness</option>
            <option value="Cosmetics">Cosmetics</option>
            <option value="Technology">Travel</option>
          </select>
          <input onChange={handlePhoto} type="file" name="file"/>
          <button>{isLoading ? <Rings/>:"Edit the product"}</button>
        </form>

        :

        <div> YOU ARE NOT ALLOWED!</div>}
      </div>

    </div>
  )
}

export default EditProductPage
