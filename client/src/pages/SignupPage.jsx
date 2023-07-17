import {Link, Navigate} from "react-router-dom"
import {useContext, useState} from "react"
import { UserContext } from "../context/UserContext"
import { Rings } from "react-loading-icons"
function SignupPage() {
  const {isRegistered, setIsRegistered, isLoading, setIsLoading} = useContext(UserContext)
  const [errors, setErrors] = useState([])
  const [emailValue, setEmailValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [nameValue, setNameValue] = useState('')
  const [surnameValue, setSurnameValue] = useState('')
  const [addressValue, setAddressValue] = useState('')

  const handleEmailChange = (event) =>{
    setEmailValue(event.target.value)
  }

  const handlePasswordChange = (event) =>{
    setPasswordValue(event.target.value)
    if (event.target.value.length < 7){
      if (!errors.includes(1)){
        setErrors([...errors, 1])
      }
    } else {
      const updatedErrors = errors.filter(error => {
        return error !== 1
      })
      setErrors(updatedErrors)
    }
  }

  const handleNameChange = (event) => {
    setNameValue(event.target.value)
  }

  const handleSurnameChange = (event) => {
    setSurnameValue(event.target.value)
  }

  const handleAddressChange = (event) => {
    setAddressValue(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (errors.length === 0){
      setIsLoading(true)
      fetch("http://localhost:8080/signup", {
        method:"POST",
        headers: {
          "Content-Type": "application/json"
        },
        body:JSON.stringify({email: emailValue, password: passwordValue, name: nameValue, surname: surnameValue, address: addressValue})
      }).then(res => res.json())
      .then(data => {
        setIsRegistered(true)
        setIsLoading(false)
      }).catch(err => {
        setIsLoading(false)
        console.log(err)
      })
    }
  }
  return (
    <div className="container">
      { isRegistered && <Navigate to="/login"/>}
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
            {errors.includes(1) && <p style={{color: "red"}}>Password must be longer than 6 characters</p>}
            <label>Name</label>
            <input onChange={handleNameChange} type="text" name="name" value={nameValue}/>
            <label>Surname</label>
            <input onChange={handleSurnameChange} type="text" name="surname" value={surnameValue}/>
            <label>Address</label>
            <input onChange={handleAddressChange} type="text" name="address" value={addressValue}/>
            <button>{isLoading ? <Rings/>:"Sign Up"}</button>
          </form>
          <div style={{display:"flex", alignItems:"center", gap:"10px", justifyContent:"center"}}>
            <p>Already have an account?</p>
            <Link to="/login">Sign In</Link>
          </div>
        </div>
        <div className="login-image">
        </div>
      </div>
    </div>
  )
}

export default SignupPage
