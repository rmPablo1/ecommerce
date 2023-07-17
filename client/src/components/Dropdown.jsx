import {useState} from "react"
import { Link } from "react-router-dom"
import {useContext} from "react"
import { productContext } from "../context/productsContext"

const CATEGORIES = [
  {label: "Sport",request: "Sport"},
  {label: "Cosmetics", request: "Cosmetics"},
  {label: "Welcome", request: "Welcome"},
  {label: "Travel", request: "Travel"},
  {label: "Technology", request: "Technology"}
]
function Dropdown() {
  const {query, setQuery} = useContext(productContext)
  const [showCategory, setShowCategory] = useState(false)

  const handleCategoryClick = (request) => {
    setQuery(request)
    setShowCategory(false)
  }

  const renderedCategories = CATEGORIES.map((category) => {
    return <Link to="/"onClick={() => handleCategoryClick(category.request)}className="dropdown-link" key={category.request}>{category.label}</Link>
  })

  const handleClick = () => {
    setShowCategory(!showCategory)
  }
  return (
    <div>
      <div className="dropdown">
        <button onClick={handleClick}> Category {showCategory ? "<": "v"}</button>
      </div>
      <div className="dropdown-items">
      {showCategory && renderedCategories}
      </div>
    </div>
  )
}

export default Dropdown
