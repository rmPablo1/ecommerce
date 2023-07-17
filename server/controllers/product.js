const Product = require("../models/product")
const User = require("../models/user")
const Order = require("../models/orders")
const product = require("../models/product")
const stripe = require("stripe")("sk_test_51N9GA9F0SJVPGyQxwVI8vDBNVyO1CXzEIqdPSoiTPcBibYrTdmlNNBinAx0PgYZDZyCUSSehYvcvY0C094e9WLDj00r2WPEjQp")

exports.index = async (req, res, next) => {
  const page = req.query.page
  const searchQuery = req.query.search
  const ITEMS_PER_PAGE = 10
  console.log(page)
  console.log(searchQuery)

  try {
    let products;
    if (page > 1) {
      if(searchQuery !== undefined && searchQuery !== ""){
        console.log("found search")
        products = await Product.find({name: {$regex: searchQuery}})
        .skip(ITEMS_PER_PAGE * (page - 1))
        .limit(ITEMS_PER_PAGE)
        console.log("products when search query",products)
      } else {
        console.log("not found search")
        products = await Product.find()
          .skip(ITEMS_PER_PAGE * (page - 1))
          .limit(ITEMS_PER_PAGE)
      }
    } else {
      if(searchQuery !== undefined && searchQuery !== ""){
        products = await Product.find({name: {$regex: searchQuery}}).limit(ITEMS_PER_PAGE)
      } else{
        products = await Product.find().limit(ITEMS_PER_PAGE)
      }
    }

    if (products.length === 0) {
      console.log("No products found")
      const error = new Error("No products found")
      error.statusCode = 404
      throw error
    }

    res.status(200).json({ message: "Products found", products: products })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.filterProducts = async (req, res, next) => {
  const {category} = req.params
  console.log(category)
  try{
    const products = await Product.find({category: category})
    if (!products){
      const error = new Error("No products found")
      error.statusCode = 404
      throw error
    }

    res.status(200).json({message: `Products with category ${category} found`, products: products})

  } catch(err){
    if(!err.statusCode){
      err.statusCode = 500
    }
    next(err)
  }
}

exports.show = async (req, res, next) => {
  const prodId = req.params.prodId
  console.log(prodId)
  try{
    const product = await Product.findById(prodId)
    if (!product){
      console.log("No products found")
      const error = new Error("No products found")
      error.statusCode = 404
      throw error
    }

    res.status(200).json({message: "Product found!", product: product})
  } catch(err){
    if (!err.statusCode){
      err.statusCode = 500
    }
    next(err)
  }
}

exports.create = async (req, res, next) => {
  console.log("on create")
  const {price, name, description, category} = req.body
  const image = req.file.path


  try{
    if (!image){
      console.log("no image found")
      const error = new Error("Error saving the product")
      error.statusCode = 500
      throw error
    }
    const product = new Product({imageUrl: image, userId: req.userId, name: name, description: description, price: price, category:category})
    const result = await product.save()
    if(!result){
      const error = new Error("Error saving the product")
      error.statusCode = 500
      throw error
    }

    res.status(201).json({message: "Product created", product: product})
    console.log("product created")
  } catch(err){
    if (!err.statusCode){
      err.statusCode = 500
    }
    next(err)
  }
}

exports.edit = async (req, res, next) => {
  const {description, name, category, price} = req.body
  let image
  try {
    const product = await Product.findById(req.params.prodId)
    if (product.userId.toString() !== req.userId.toString()){
      const error = new Error("Not authorized")
      error.statusCode = 403
      throw error
    }

    if(!req.file){
      console.log("no image provided")
      image = product.imageUrl
    } else{
       console.log("image provided")
      image = req.file.path
    }

    product.description = description
    product.name = name
    product.category = category
    product.price = price
    product.imageUrl = image
    const result = await product.save()

    res.status(201).json({message: "Product updated successfully", product: product})

  } catch(err) {
    if (!err.statusCode){
      err.statusCode = 500
    }
    next(err)
  }
}
exports.cart = async (req, res ,next) => {
  try {
    // replace with actual user
    const user = await User.findById(req.userId).populate("cart.products.productId")
    if (!user){
      const error = new Error("User not found")
      error.statusCode = 404
      throw error
    }

    res.status(200).json({message: "Cart retrieved successfully", cart: user.cart.products})

  }catch(err){
    if (!err.statusCode){
      err.statusCode = 500
    }
    next(err)
  }
}

exports.addCart = async (req, res, next) => {
  const {prodId, quantity} = req.body
  try {
    const product = await Product.findById(prodId)
    //change later with actual user
    const user = await User.findById(req.userId)

    if(!product){
      const error = new Error("Product not found")
      error.statusCode = 404
      throw error
    }

    const cartProductIndex = user.cart.products.findIndex(cp => {
      return cp.productId.toString() === product._id.toString()
    })

    let newQuantity = quantity
    const updatedCartItems = [...user.cart.products]

    if (cartProductIndex >=  0){
      newQuantity = user.cart.products[cartProductIndex].quantity + quantity
      updatedCartItems[cartProductIndex].quantity = newQuantity
    } else {
      updatedCartItems.push({productId: prodId, quantity: newQuantity})
    }

    const updatedCart = {
      products: updatedCartItems
    }

    user.cart = updatedCart
    await user.save()
    res.status(200).json({message: "Product added successfully", cart: user.cart})
  } catch (err){
    if(!err.statusCode){
      err.statusCode = 500
    }
    next(err)
  }
}

exports.clearCart = async (req, res, next) => {
  try{
    const user = await User.findById(req.userId)
    user.cart = {
      products: []
    }
    await user.save()
    res.status(200).json({products: user.cart.products})
  } catch(err){
    if (!err.statusCode){
      err.statusCode = 500
    }
    next(err)
  }
}

exports.checkout = async(req, res, next) => {
  const {products} = req.body
  console.log(products)
  try{
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.products.map(product => {
        return {
          price_data:{
            currency: "eur",
            product_data:{
              name: product.productId.name
            },
            unit_amount: product.productId.price * 100
          },
          quantity: product.quantity
        }
      }),
      success_url: "http://localhost:5173/orders",
      cancel_url: "http://localhost:5173/"
    })
    console.log(session)

    res.status(200).json({url: session.url})

  } catch(err){
    if(!err.statusCode){
      err.statusCode = 500
    }
    next(err)
  }
}

exports.getOrders = async (req,res,next) => {
  try {

    const orders = await Order.find({"user.userId": req.userId})
    console.log(orders)
    if(!orders){
      const error = new Error("No orders found")
      error.statusCode = 404
      throw error
    }

    res.status(200).json({message: "Orders retrieved", orders: orders})


  } catch(err){
    if (!err.statusCode){
      err.statusCode = 500
    }
    next(err)
  }
}

exports.addOrder = async (req, res, next) => {
  // replace with actual user
  try {
    const user = await User.findById(req.userId).populate("cart.products.productId")
    const products = user.cart.products.map(product => {
      return {quantity: product.quantity, product: {...product.productId._doc}}
    })
    const order = new Order({products: products, user: {email: user.email, userId: user._id}})
    await order.save()
    res.status(201).json({message: "Order added successfully", order: order})
    user.cart.products = []
    await user.save()

  } catch(err){
    if (!err.statusCode){
      err.statusCode = 500
    }
    next(err)
  }
}

exports.whatsnew = async (req, res, next) => {
  try{
    const products = await Product.find().sort({createdAt: "asc"}).limit(10)

    if (!products){
      const error = new Error("no products found")
      error.statusCode = 404
      throw error
    }

    res.status(200).json({products: products})
  } catch(err){
    if (!err.statusCode){
      err.statusCode = 500
    }
    next(err)
  }
}
