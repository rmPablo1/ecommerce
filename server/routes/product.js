const express = require("express")
const {body} = require("express-validator")
const router = express.Router()
const isAuth = require("../middlewares/is-auth")
const productsController = require("../controllers/product")

router.get("/", productsController.index)

router.get("/categories/:category", productsController.filterProducts)

router.get("/product/:prodId", productsController.show)

router.get("/whatsnew", productsController.whatsnew)
router.post("/add-product", isAuth, [
  body("name", "Name must be longer than 6 characters").isLength({min: 7}),
  body("description", "Description must be longer than 29 characters").isLength({min: 30})
] , productsController.create)

router.post("/checkout", isAuth, productsController.checkout)

router.patch("/edit/:prodId", isAuth, [
  body("name", "Name must be longer than 6 characters").isLength({min: 7}),
  body("description", "Description must be longer than 29 characters").isLength({min: 30})
], productsController.edit)

router.get("/cart", isAuth, productsController.cart)

router.post("/order", isAuth, productsController.addOrder)

router.get("/orders", isAuth, productsController.getOrders)

router.post("/cart", isAuth, productsController.addCart)

router.post("/clear-cart", isAuth, productsController.clearCart)
module.exports = router
