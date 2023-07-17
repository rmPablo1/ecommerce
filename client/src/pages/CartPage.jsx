import {useContext, useEffect, useState} from "react"
import {Link, Navigate} from "react-router-dom"
import { UserContext } from "../context/UserContext"
import Header from "../components/Header"
import {AiOutlineClear} from "react-icons/ai"
import Navbar from "../components/Navbar"
function CartPage() {
  const {userInfo, isAuth} = useContext(UserContext)
  const [products, setProducts] = useState([])

  useEffect(()=>{

    if(userInfo.token !== undefined){
      fetch("http://localhost:8080/cart", {
         headers: {
           "Authorization": "Bearer " + userInfo.token
         }
       }).then(res => res.json())
       .then(data => {
        setProducts(data.cart)
       })
    }
  }, [userInfo.token])

  const handlePayment = () => {
    fetch("http://localhost:8080/checkout", {
      method:"POST",
      headers:{
        "Content-Type": "application/json",
        "Authorization": "Bearer "+ userInfo.token
      },
      body: JSON.stringify({products: products})
    }).then(res => {
      if (res.ok) return res.json()
      console.log("error")
    }).then(({url}) => {
      window.open(url, '_blank').focus();
      fetch("http://localhost:8080/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + userInfo.token
        }
      }).then(res =>{
        if (res.ok) return res.json()
      }).then(data => {
        console.log(data)
      })
    })
  }

  const handleClear = () => {
    fetch("http://localhost:8080/clear-cart", {
      method: "POST",
      headers: {
        "Authorization": "Bearer "+ userInfo.token,
        "Content-Type": "application/json"
      }
    }).then(res => {
      if (res.ok) return res.json()
    })
    .then(data => {
      setProducts(data.products)
      console.log("inside fetch")
    })
  }

  let totalAmount = 0

  let renderProducts
  if (products.length > 0){
     renderProducts = products.map((product) => {
      totalAmount += product.productId.price * product.quantity
      return <div className="cart-product" key={product._id}><h2>{product.productId.name.slice(0,20)}</h2>  <h2>{product.productId.price}€   -   Quantity:{product.quantity}</h2></div>
    })

  }

  console.log(typeof products)



  return (
    <div>
      <Header/>
      <Navbar/>
      {!isAuth && <Navigate to="/login"/>}
      <div className="cart-container">
        {products === [] ? "Cart is empty!": renderProducts}
        {products !== [] && <hr/> }
        {products !== [] ?<h2 className="total-amount"><button onClick={handlePayment} className="cart-button">Order Now!</button> <button onClick={handleClear} className="cart-button"><AiOutlineClear/></button> TOTAL: {totalAmount} €</h2> : ""}
      </div>
    </div>
  )
}

export default CartPage
