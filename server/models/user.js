const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  cart: {
    products: [{
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product"
      },
      quantity: {
        type: Number
      }
    }]
  }
})

module.exports = mongoose.model("User", userSchema)
