// 📁 models/EmployeeModel.js
const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    jobType: { type: String, enum: ["oylik", "dagavor", "menejer"], required: true },
    salary: { type: Number, required: true },
    password: { type: String, required: true },
    username: {
        type: String,
        unique: true, // ✅ noyob bo‘lishi shart
        required: true,
      },
      
      
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
