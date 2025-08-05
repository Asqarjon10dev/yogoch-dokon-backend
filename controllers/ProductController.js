// backend/controllers/ProductController.js
const Product = require("../models/ProductModels");
const response = require("../utils/response");

class ProductController {
  // 🟢 1. Mahsulot (taxta) qo‘shish
  async createProduct(req, res) {
    try {
      const {
        name,
        category,       // masalan: "Qarag'ay", "Terak"
        unit,           // "dona" yoki "kub"
        width,          // en
        height,         // balandlik
        length,         // uzunlik
        kub,            // agar mavjud bo‘lsa
        quantity,       // nechta dona
        price,          // dona/kub narxi
        currency,       // so'm yoki $
        supplier,      
        sellPrice, // 🆕 // optional
        code            // noyob kod (0001, 0002...)
      } = req.body;

      // 🔒 Majburiy maydonlar tekshiruvi
      if (!name || !category || !quantity || !price || !sellPrice || !code || !currency || !unit) {
        return response.error(res, "Majburiy maydonlar to‘ldirilishi kerak");
      }
      

      // 🔁 Kod takrorlanmasligini tekshirish
      const exists = await Product.findOne({ code });
      if (exists) {
        return response.error(res, "Bu kodli mahsulot allaqachon mavjud");
      }

      // 📐 Kubni avtomatik hisoblash (agar yo‘q bo‘lsa)
      const calculatedKub =
        !kub && width && height && length
          ? ((width * height * length) / 1000000).toFixed(3)
          : kub;

      // 💰 Umumiy narx hisoblash
      const totalPrice = (price * quantity).toFixed(2);

      const newProduct = new Product({
        name,
        category,
        unit: unit || "dona",
        width,
        height,
        length,
        kub: calculatedKub,
        quantity,
        price,
        currency: currency || "so'm",
        totalPrice,
        sellPrice,
        supplier,
        code,
      });

      const saved = await newProduct.save();
      return response.created(res, "Mahsulot muvaffaqiyatli qo‘shildi", saved);
    } catch (err) {
      console.error("❌ createProduct Error:", err.message);
      return response.serverError(res, "Serverda xatolik yuz berdi");
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
