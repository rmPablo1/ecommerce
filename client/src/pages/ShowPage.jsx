import Header from '../components/Header'
import Navbar from '../components/Navbar'
import {useParams, Link, redirect} from "react-router-dom"
import { useContext, useEffect, useState} from 'react'
import {Rings} from "react-loading-icons"
import { UserContext } from '../context/UserContext'
import Cookie from "universal-cookie"
function ShowPage() {
  const cookies = new Cookie()
  const {userInfo, isAuth} = useContext(UserContext)
  const prodId = useParams().id
  const [product, setProduct] = useState({})
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isAuth){
      if(cookies.get("recently") !== undefined){
        const valueCookie = cookies.get("recently")
        console.log(valueCookie)
        const updatedCookie = valueCookie + `${prodId},`
        cookies.remove("recently")
        cookies.set("recently", updatedCookie)
      } else {
        cookies.set("recently", `${prodId},`)
      }
    }
  }, [prodId])
  const handleClick = () => {
    setIsLoading(true)
    fetch("http://localhost:8080/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // CAMBIAR TOKEN
        "Authorization": "Bearer " + userInfo.token
      },
      body: JSON.stringify({prodId: prodId, quantity: quantity})
    }).then(res => res.json())
    .then(data => {
      console.log(data)
      setIsLoading(false)
      redirect("/cart")
    })
  }

  const handleMinus = () => {
    console.log(product)
    if (quantity !== 1){
      setQuantity(quantity - 1)
    }
  }

  const handlePlus = () => {
    setQuantity(quantity + 1)
  }
  useEffect(() => {
    fetch("http://localhost:8080/product/"+ prodId)
    .then(res => res.json())
    .then(data => {
      setProduct(data.product)
    })
  }, [prodId])


  return (
    <div>
      <Header/>
      <Navbar/>
      <div className="container">
        <div style={{borderTop: "1px solid #ddd", marginTop:"30px"}}>
        <p style={{marginTop:"70px", color:"#bbb"}}>
          {product.category} / <span style={{color:"black", fontWeight:"bold"}}>{product.name}</span>
        </p>

        <div className="show-product">
          <div className="show-product-images-container">
            {product.imageUrl ? <img src={`http://localhost:8080/${product.imageUrl}`}/> : <img src="https://user-images.githubusercontent.com/24848110/33519396-7e56363c-d79d-11e7-969b-09782f5ccbab.png"/>}
          </div>
          <div className="show-product-description">
            <div style={{marginBottom:"30px"}}>
              <h2 style={{fontSize:"30px"}}>{product.name}</h2>
              <p style={{color:"#aaa", fontWeight:"bold"}}>{product.description}</p>
              <hr/>
            </div>
            <div style={{marginBottom:"30px"}}>
              <h3 style={{fontSize:"30px"}}>{product.price} €</h3>
              <p style={{color:"#aaa", fontWeight:"bold"}}>Product doesn't include delivery taxes</p>
              <hr/>
            </div>
            <div style={{display: "flex", gap:"30px"}}>
              <div className="show-product-quantity">
                <p onClick={handleMinus}>-</p>
                {quantity}
                <p onClick={handlePlus}>+</p>
              </div>
              <div>
                <p>Only <span style={{color: "#E28F49", fontWeight:"bold"}}>12 items</span> Left!</p>
                <p>Don't Miss It!</p>
              </div>
            </div>
            {
            userInfo.userId !== product.userId ?
            <div>
            <div className="show-product-buy-buttons">
              <button>Buy Now</button>
              <button onClick={handleClick}>{isLoading ? <Rings/>: "Add to cart"}</button>
            </div>
            </div>
            :
            <div className="show-product-buy-buttons">
              <Link to={`/edit/${product._id}`} >Edit Product</Link>
            </div>
            }
          </div>

        </div>
        </div>
      </div>
    </div>
  )
}

export default ShowPage
