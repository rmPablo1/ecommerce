import './App.css'
import IndexPage from './pages/indexPage'
import ShowPage from './pages/ShowPage'
import {Routes, Route} from "react-router-dom"
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import AddProductPage from './pages/AddProductPage'
import CartPage from './pages/CartPage'
import EditProductPage from './pages/EditProductPage'
import OrdersPage from './pages/OrdersPage'
import Footer from "./components/Footer"
import Whatsnew from './pages/Whatsnew'
function App() {

  return (
    <div style={{display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
    <Routes>
      <Route path="/" element={<IndexPage />}/>
      <Route path="/product/:id" element={<ShowPage/>}/>
      <Route path="/add-product" element={<AddProductPage/>}/>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/signup" element={<SignupPage/>}/>
      <Route path="/edit/:prodId" element={<EditProductPage/>}/>
      <Route path="/cart" element={<CartPage/>}/>
      <Route path="/orders" element={<OrdersPage/>}/>
      <Route path="/whatsnew" element={<Whatsnew/>}/>
    </Routes>
    <Footer />
    </div>
  )
}

export default App
