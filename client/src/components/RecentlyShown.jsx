import Cookies from 'universal-cookie'
import {useEffect, useState} from "react"
function RecentlyShown() {
  const cookies = new Cookies()
  const [productRecently, setProductRecently] = useState([])
  const [recentlyViewed, setRecentlyViewed] = useState(cookies.get("recently"))

  
  return (
    <div className="container">
      <div className="recently-box">

      </div>
    </div>
  )
}

export default RecentlyShown
