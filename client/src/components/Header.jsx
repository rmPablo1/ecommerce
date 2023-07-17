import React from 'react'
import {AiFillPhone} from "react-icons/ai"
function Header() {
  return (
    <div className="header">
      <div className="container-header">
        <div>
          <p style={{display:"flex", width:"120px", alignItems:"center", justifyContent: "space-around"}}><AiFillPhone/>+145784562</p>
        </div>
        <div>
          <p>Get 50% Off on Selected Items | Shop Now </p>
        </div>
        <div>

        </div>
      </div>
    </div>
  )
}

export default Header
