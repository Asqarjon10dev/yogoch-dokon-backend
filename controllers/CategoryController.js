// controllers/CategoryController.js
const Category = require("../models/CatagoryModels");
const { success, error, notFound, serverError, created } = require("../utils/response");

class CategoryController {
  // ➕ Qo‘shish
  async addCategory(req, res) {
    try {
      const { name } = req.body;
      if (!name) return error(res, "Kategoriya nomi kerak");

      const exists = await Category.findOne({ name });
      if (exists) return error(res, "Bu kategoriya mavjud");

      const saved = await new Category({ name }).save();
      return created(res, "Kategoriya qo‘shildi", saved);
    } catch (err) {
      console.error("addCategory error:", err.message);
      return serverError(res);
    }
  }

  // 🔽 Barchasi
  async getAllCategories  (req, res) {
    try {
      const categories = await Category.find().sort({ createdAt: -1 });
      success(res, "Barcha kategoriyalar", categories);
    } catch (err) {
      error(res, "Kategoriyalarni olishda xatolik", err);
    }
  };

  // ❌ O‘chirish
  async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Category.findByIdAndDelete(id);
      if (!deleted) return notFound(res, "Kategoriya topilmadi");
      return success(res, "Kategoriya o‘chirildi", deleted);
    } catch (err) {
      console.error("deleteCategory error:", err.message);
      return serverError(res, "Kategoriya o‘chirishda xatolik");
    }
  }
}

module.exports = new CategoryController();
