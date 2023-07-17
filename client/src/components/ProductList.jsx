import {useContext} from 'react'
import { productContext } from '../context/productsContext'
import ProductShow from './ProductShow'
import Cookies from "universal-cookie"
import { UserContext } from '../context/UserContext'

function ProductList() {
  const cookies = new Cookies()
  const {products, query} = useContext(productContext)
  const {isAuth} = useContext(UserContext)

  let queryUndefined = query !== "undefined"

  const renderedProducts = products.map((product) => {
    return <ProductShow key={product._id} product={product}/>
  })
  return (
    <div className="container">
      <h2>
        {queryUndefined  && `${query} items for you!`}
      </h2>
      <div className=" grid">{renderedProducts}</div>
    </div>
  )
}

export default ProductList
