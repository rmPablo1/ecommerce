import React, { useContext } from 'react'
import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import jwt from "jwt-decode"
import Cookies from "universal-cookie"
import { UserContext } from '../context/UserContext'
import {Rings} from "react-loading-icons"

const cookies = new Cookies()

function LoginPage() {
  const {setUserInfo, setIsAuth, isAuth, setIsRegistered, isLoading, setIsLoading} = useContext(UserContext)
  const [error, setError] = useState([])
  const [emailValue, setEmailValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')

  setIsRegistered(false)

  const handleEmailChange = (event) =>{
    setEmailValue(event.target.value)
  }

  const handlePasswordChange = (event) =>{
    setPasswordValue(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setIsLoading(true)
    fetch("https://backendshopmefy.onrender.com/login", {
      method:"POST",
      headers: {
        "Content-Type": "application/json"
      },
      body:JSON.stringify({email: emailValue, password: passwordValue})
    }).then(res => res.json())
    .then(data => {
      const decodedToken = jwt(data.token)
      setUserInfo({...decodedToken, token: data.token})
      setIsAuth(true)
      console.log(isAuth)
      cookies.set("auth-ec", data.token, {
        expires: new Date(decodedToken.exp*1000)
      })
      setIsLoading(false)
    }).catch(err => {
      console.log(err)
      setIsLoading(false)
    })
  }
  return (
    <div className="container">
      {isAuth && <Navigate to="/"/>}
      <div className="login-container">
        <div className="login-info">
          <div>
            <h2>Welcome!</h2>
            <p>The faster you fill up, the faster you get to buy</p>
          </div>
          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input onChange={handleEmailChange} type="email" name="email" value={emailValue}/>
            <label>Password</label>
            <input onChange={handlePasswordChange}type="password" name="password" value={passwordValue}/>
            <button>{isLoading ? <Rings/>:"Sign In"}</button>
          </form>
          <div style={{display:"flex", alignItems:"center", gap:"10px", justifyContent:"center"}}>
            <p>Don't have an account?</p>
            <Link to="/signup">Sign Up</Link>
          </div>
        </div>
        <div className="login-image">
        </div>
      </div>
    </div>
  )
}

export default LoginPage
