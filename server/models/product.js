const mongoose = require("mongoose")

const Schema = mongoose.Schema

const productSchema = new Schema({
  price: {
    type: Number,
    required: true
  },
  review:{
    type: Number,
    default: 0
  },
  totalReviews:{
    type: Number,
    default: 0
  },
  category: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: false
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
}, {timestamps: true})

module.exports = mongoose.model("Product", productSchema)
