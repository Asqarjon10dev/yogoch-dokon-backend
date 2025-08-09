// 📁 models/AdvanceHistoryModel.js
const mongoose = require("mongoose");

const advanceHistorySchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    amount: { type: Number, required: true },
    note: { type: String, default: "" },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Nodemon qayta yuklanganda "OverwriteModelError" bo'lmasligi uchun:
module.exports =
  mongoose.models.AdvanceHistory ||
  mongoose.model("AdvanceHistory", advanceHistorySchema);
