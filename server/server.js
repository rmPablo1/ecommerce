const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const productRoutes = require("./routes/product")
const authRoutes = require("./routes/auth")
const multer = require("multer")
const {uuid} = require("uuidv4")
const path = require("path")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images")
  },
  filename: (req,file, cb) => {
    console.log("on filename")
    cb(null, uuid() + `.${file.mimetype.split("/")[1]}`)
  }
})

const fileFilter = (req,  file, cb) =>{
  if (file.mimetype === "image/jpg" || file.mimetype === "image/png" || file.mimetype === "image/jpeg"){
    console.log("on file filter")
    cb(null, true)
  } else{
    cb(null, false)
  }
}
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  next()
})


app.use(bodyParser.json())
app.use(multer({storage: storage, fileFilter: fileFilter}).single("image"))
app.use("/images", express.static(path.join(__dirname, "images")))
app.use(productRoutes)
app.use(authRoutes)

app.use((err, req, res, next) => {
  console.log(err)
  res.status(err.statusCode || 500).json({message: "There was a huge error"})
  next()
})

mongoose.connect("mongodb+srv://rmPablo:Pabroskryto1@ecommerce-app.h3ywmkn.mongodb.net/shop?retryWrites=true&w=majority")
.then(result => {
  console.log("connected")
  app.listen(8080)
})
