const jwt = require("jsonwebtoken")

module.exports = async (req, res, next) => {
  const authHeader = req.get("Authorization")
  console.log(authHeader)
    if(!authHeader){
      const error = new Error("Not authenticated")
      error.statusCode = 401
      throw error
    }
  const token = authHeader.split(" ")[1]
  let decodedToken

  try{
    decodedToken = jwt.verify(token, "GKokgsGK3OROTOgjok")
  } catch(err){
    if(!err.statusCode){
      err.statusCode = 500
    }
    next(err)
  }

  if(!decodedToken){
    const error = new Error("Not authenticated")
    error.statusCode = 401
    throw error
  }

  req.userId = decodedToken.userId
  next()

}
