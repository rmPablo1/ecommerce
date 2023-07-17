const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.login = async (req, res, next) => {
  const {email, password} = req.body
  console.log(email, password)

  try{
    const user = await User.findOne({email: email})

    if(!user){
      const error = new Error("Credentials are not correct")
      error.statusCode = 401
      throw error
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch){
      const error = new Error("Credentials are not correct")
      error.statusCode = 403
      throw error
    }

    const token = jwt.sign({
      userId: user._id,
      address: user.address,
      name: user.name,
      surname: user.surname,
      email: email,
      userId: user._id
    }, "GKokgsGK3OROTOgjok", {expiresIn: "1hr"})

    res.status(200).json({message: "Logged in successfully", user:user, token: token})


  } catch (err){
    if(!err.statusCode){
      err.statusCode = 500
    }
    next(err)
  }

}

exports.signup = async (req, res, next) => {
  const {email, password, name, surname, address} = req.body
  console.log("in signup controller")
  try{
    const user = await User.findOne({email: email})

    if (user){
      const error = new Error("User already exists")
      error.statusCode = 401
      throw error
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const newUser = new User({email: email, password: hashedPassword, name: name, surname: surname, address: address})
    await newUser.save()
    res.status(201).json({message: "User created successfully", status: 201})

  } catch (err) {
    if (!err.statusCode){
      err.statusCode = 500
    }
    next(err)
  }
}
