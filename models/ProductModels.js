  // 📁 models/Product.js
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

      width: {
        type: Number,
        required: true,
      },
      height: {
        type: Number,
        required: true,
      },
      length: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        enum: ["kub", "dona"],
        required: true,
        default: "kub", // bu sizning tizimingizga qarab belgilanadi
      },
      totalKub: {
        type: Number,
        default: 0,
      },
      pricePerKub: {
        type: Number,
        required: true,
      },
      sellPricePerKub: {
        type: Number,
        required: true,
      },
      totalPrice: {
        type: Number,
      },
      currency: {
        type: String,
        enum: ["so'm", "$"],
        required: true,
        default: "so'm",
      },
      supplier: {
        type: String,
      },
    },
    {
      timestamps: true,
    }
  );

  module.exports = mongoose.model("Product", productSchema);
