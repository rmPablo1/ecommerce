import {createContext, useEffect, useState} from "react"
import Cookie from "universal-cookie"
import jwt from "jwt-decode"

const cookies = new Cookie()
const UserContext = createContext()

function UserProvider({children}){
  const [userInfo, setUserInfo] = useState({})
  const [isAuth, setIsAuth] = useState(false)
  const [authToken, setAuthToken] = useState('')
  const [isRegistered, setIsRegistered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let token = cookies.get("auth-ec")
    if(token){
      const decodedUserInfo = jwt(token)
      setUserInfo({...decodedUserInfo, token: token})
      setIsAuth(true)
    } else{
      setIsAuth(false)
      console.log("No Cookie Found")
    }
  },[])

  const toShare={
    userInfo,
    setUserInfo,
    isAuth,
    setIsAuth,
    authToken,
    setAuthToken,
    isRegistered,
    setIsRegistered,
    isLoading,
    setIsLoading
  }

  return <UserContext.Provider value={toShare}>
    {children}
  </UserContext.Provider>
}

export {UserContext, UserProvider}
