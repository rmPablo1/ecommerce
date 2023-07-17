import Header from "../components/Header"
import Navbar from "../components/Navbar"
import HeroBanner from "../components/HeroBanner"
import ProductList from "../components/ProductList"
import { productContext } from "../context/productsContext"
import { useContext } from "react"
import RecentlyShown from '../components/RecentlyShown'
function IndexPage() {
  const {page, setPage, products} = useContext(productContext)

  const handlePrevPagination = () => {
    setPage(page - 1)
  }

  const handleNextPagination = () => {
    setPage(page + 1)
    console.log(page)
    console.log(products.length)
  }
  return (
    <div>
      <Header/>
      <Navbar/>
      <HeroBanner/>
      <ProductList/>
      <div style={{display:"flex", justifyContent:"center", gap: "30px"}}>
        {page !== 1 && <p className="paginationButton" onClick={handlePrevPagination}><strong>Prev</strong></p>}
        {products.length === 10 &&<p className="paginationButton" onClick={handleNextPagination}><strong>Next</strong></p>}
      </div>
    </div>
  )
}

export default IndexPage
