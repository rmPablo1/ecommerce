import { useContext } from "react"
import { productContext } from "../context/productsContext"
import headphoneGirl from "../assets/images/descarga__8_-removebg-preview.png"
function HeroBanner() {
  const {setQuery} = useContext(productContext)
  const handleClick = () =>{
    setQuery("headphones")
  }
  return (
    <div className="container hero-banner">
      <div>
        <h1>Grab Upto 50% Off On Selected Headphones!</h1>
        <button onClick={handleClick}>Buy Now</button>
      </div>
      <img src={headphoneGirl}/>
    </div>
  )
}

export default HeroBanner
