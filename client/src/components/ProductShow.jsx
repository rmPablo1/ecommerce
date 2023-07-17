import { useContext } from "react"
import {Link} from "react-router-dom"
import {UserContext} from "../context/UserContext"
function ProductShow({product}) {
  const {isAuth, userInfo} = useContext(UserContext)
  const prodId = {prodId: product._id}
  const handleClick = () => {
    fetch("http://localhost:8080/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // CAMBIAR TOKEN
        "Authorization": "Bearer " + userInfo.token
      },
      body: JSON.stringify(prodId)
    }).then(res => res.json())
    .then(data => {
      console.log(data)
    })
  }

  return (
    <Link to={"/product/"+product._id}>
        {product.imageUrl ? <img src={`http://localhost:8080/${product.imageUrl}`} className="product-card-image"/> : <img className="product-card-image" src="https://user-images.githubusercontent.com/24848110/33519396-7e56363c-d79d-11e7-969b-09782f5ccbab.png"/>}
      <div className="product-card-info">
        <div>
          <p><strong>{product.name.slice(0,15)}{product.name.length > 15 && "..."}</strong></p>
          {(isAuth && userInfo.userId !== product.userId) && <button onClick={handleClick}>Add to Cart</button>}
        </div>
        <p><strong>{product.price} €</strong></p>
      </div>
    </Link>
  )
}

export default ProductShow
