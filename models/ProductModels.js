const mongoose = require("mongoose");


const productSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      enum: ["dona", "kub"],
      default: "dona",
    },
    width: Number,
    height: Number,
    length: Number,
    kub: Number,
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true, // bu kirim (asliy) narx
    },
    sellPrice: {
      type: Number,
      required: false, // bu sotish narxi (optional)
    },
    currency: {
      type: String,
      enum: ["so'm", "$"],
      default: "so'm",
    },
    totalPrice: Number,
    supplier: String,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Product", productSchema);

