// backend/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const routers = require("./routers"); // ✅ routers/index.js ni chaqirayapmiz

const app = express();
app.use(express.json());

// CORS ruxsatlari
app.use(
  cors({
    origin: ["http://localhost:3000", "https://yog-och-do-kon.vercel.app"], // frontend manzillari
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // ✅ PATCH qo‘shildi
    credentials: true,
  })
);

// MongoDB ulanish
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB ga ulandi ✅✅✅✅✅✅✅✅✅✅✅✅✅✅"))
  .catch((err) => console.error("MongoDB xatosi:", err));

// Marshrutlarni ulash
app.use("/api", routers); // ✅ ENG MUHIM QATOR shu

// Test uchun
app.get("/api", (req, res) => {
  res.send("App is running");
});

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server ${PORT}-portda ishlayapti`));
