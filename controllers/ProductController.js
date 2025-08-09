// backend/controllers/ProductController.js
const Product = require("../models/ProductModels");
const response = require("../utils/response");

class ProductController {
  // 🟢 1. Mahsulot (taxta) qo‘shish
  async createProduct(req, res) {
    try {
      const {
        name,
        category,
        width,
        height,
        length,
        pricePerKub,
        sellPricePerKub,
        currency,
        supplier,
        code,
      } = req.body;
  
      // 🔒 Tekshiruv
      if (
        !name ||
        !category ||
        !width ||
        !height ||
        !length ||
        !pricePerKub ||
        !sellPricePerKub ||
        !currency ||
        !code
      ) {
        return response.error(res, "Majburiy maydonlar to‘ldirilishi kerak");
      }
  
      // 🔁 Kod takrorlanmasligi
      const exists = await Product.findOne({ code });
      if (exists) return response.error(res, "Bu kodli mahsulot mavjud");
  
      // 📐 Hisoblash (faqat 1 dona mahsulot uchun)
      const kub = Number((width * height * length).toFixed(4));
      const totalKub = kub;
      const totalPrice = Number((pricePerKub * kub).toFixed(2));
  
      // ✅ Mahsulotni saqlash
      const newProduct = new Product({
        name,
        category,
        width,
        height,
        length,
        kub,
        totalKub,
        pricePerKub,
        sellPricePerKub,
        totalPrice,
        currency,
        supplier,
        code,
      });
  
      const saved = await newProduct.save();
      return response.created(res, "Mahsulot qo‘shildi", saved);
    } catch (err) {
      console.error("createProduct Error:", err.message);
      return response.serverError(res, "Serverda xatolik");
    }
  }
  

  // 🟡 2. Barcha mahsulotlarni olish
  async getAllProducts(req, res) {
    try {
      const products = await Product.find().sort({ createdAt: -1 });
      return response.success(res, "Barcha mahsulotlar", products);
    } catch (err) {
      console.error("getAllProducts Error:", err.message);
      return response.serverError(res, "Mahsulotlarni olishda xatolik");
    }
  }

  // 🔵 3. Mahsulotni yangilash
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const updated = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updated) return response.notFound(res, "Mahsulot topilmadi");
      return response.success(res, "Mahsulot yangilandi", updated);
    } catch (err) {
      console.error("updateProduct Error:", err.message);
      return response.serverError(res, "Tahrirlashda xatolik yuz berdi");
    }
  }

  // 🔴 4. Mahsulotni o‘chirish
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Product.findByIdAndDelete(id);
      if (!deleted) return response.notFound(res, "Mahsulot topilmadi");
      return response.success(res, "Mahsulot o‘chirildi", deleted);
    } catch (err) {
      console.error("deleteProduct Error:", err.message);
      return response.serverError(res, "O‘chirishda xatolik yuz berdi");
    }
  }
}

module.exports = new ProductController();
