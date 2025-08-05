const mongoose = require("mongoose");

const debtSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    debtAmount: { type: Number, required: true },
    dueDate: Date,
    status: {
      type: String,
      enum: ["qarz", "to‘langan", "qisman to‘langan"],
      default: "qarz",
    },
    saleId: { type: mongoose.Schema.Types.ObjectId, ref: "Sale" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Debt", debtSchema);
