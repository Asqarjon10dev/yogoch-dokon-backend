const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    products: [
      {
        productId: String,
        name: String,
        code: String,
        quantity: Number,
        price: Number,
        currency: String,
        cost: Number,
      },
    ],
    customerName: String,       // ✅ kerak
    customerPhone: String,      // ✅ kerak
    paymentType: String,
    paidAmount: Number,
    totalAmount: Number,
    dueAmount: Number,
    dueDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sale", saleSchema);
