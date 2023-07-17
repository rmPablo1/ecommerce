import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Navbar from '../components/Navbar'
import HeroBanner from '../components/HeroBanner'
import ProductShow from "../components/ProductShow"
function Whatsnew() {
  const [products, setProducts] = useState([])
  useEffect(()=> {
    fetch("http://localhost:8080/whatsnew")
    .then(res => res.json())
    .then(data => {
      setProducts(data.products)
    })
  })

  const renderedProducts = products.map((product) => {
    return <ProductShow key={product._id} product={product}/>
  })

  return (
    <>
      <Header/>
      <Navbar/>
      <HeroBanner/>
      <div className="container">
        <h2>Latest items</h2>
      <div className=" grid">{renderedProducts}</div>
    </div>
    </>
  )
}

export default Whatsnew
