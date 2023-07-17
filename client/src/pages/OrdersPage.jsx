import {useEffect, useState} from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import { useContext } from 'react'
import { UserContext } from '../context/UserContext'

function OrdersPage() {
  const [orders, setOrders] = useState([])
  const {userInfo} = useContext(UserContext)
  useEffect(() => {
    if (userInfo.token !== undefined){
      fetch("http://localhost:8080/orders", {
        headers:{
          "Content-Type": "application/json",
          "Authorization": "Bearer " + userInfo.token
        }
      }).then(res => {
        if (res.ok) return res.json()
      })
      .then(data => {
        console.log("orders,",data.orders)
        setOrders(data.orders)
      })
    }
  }, [userInfo.token])

  const renderedOrders = orders.reverse().map(order => {
    return <h2 key={order._id}>Order #{order._id} - {order.createdAt}</h2>
  })
  return (
    <div>
      <Header/>
      <Navbar/>
      <div className="container" style={{marginTop: "150px", display:"flex", flexDirection: "column"}}>
        {renderedOrders}
      </div>
    </div>
  )
}

export default OrdersPage
