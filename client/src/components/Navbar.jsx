import {Link} from "react-router-dom"
import Dropdown from "./Dropdown"
import SearchInput from "./SearchInput"
import { useContext } from "react"
import { UserContext } from "../context/UserContext"
import {AiOutlineShoppingCart,AiOutlineLogout,AiOutlineLogin} from "react-icons/ai"
import Logout from "./Logout"
import Cookie from "universal-cookie"

const cookies = new Cookie()
const LINKS = [
  {to:"/whatsnew", label: "What's New"},
]

function Navbar() {
  const {isAuth, userInfo, setIsAuth, setUserInfo} = useContext(UserContext)

  const handleLogout = () => {
    cookies.remove("auth-ec")
    setUserInfo({})
    setIsAuth(false)
  }

  const renderedLinks = LINKS.map((link) => {
    return <Link to={link.to}key={link.label}>{link.label}</Link>
  })

  return (
    <div className="container">
      <div className="navbar-list">
        <Dropdown/>
        <div className="shop-links">
          {renderedLinks}
          {isAuth && <Link to="/add-product">Add a Product!</Link>}
        </div>
        <SearchInput/>
        <div style={{display:"flex", alignItems:"center"}}>
          {isAuth ? <Link>{userInfo.name}</Link> : <Link to="/login"><AiOutlineLogin style={{fontSize:"30px"}} /></Link>}
          {isAuth && <Link onClick={handleLogout}> <AiOutlineLogout style={{fontSize:"30px"}}/></Link>}
          {isAuth && <Link to="/cart"><AiOutlineShoppingCart style={{fontSize:"30px"}}/></Link>}
        </div>
      </div>
    </div>
  )
}

export default Navbar
