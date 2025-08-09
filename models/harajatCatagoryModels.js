// models/ExpenseCategory.js
const mongoose = require("mongoose");

const expenseCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,            // nom takrorlanmasin
      minlength: 2,
      maxlength: 50,
    },
    // ixtiyoriy: belgi/rang kiritmoqchi bo'lsangiz
    icon: String,
    color: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExpenseCategory", expenseCategorySchema);
