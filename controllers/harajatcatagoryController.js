// controllers/expenseCategoryController.js
const ExpenseCategory = require("../models/harajatCatagoryModels");
const { success, error, notFound } = require("../utils/response");

// POST /api/expense-categories
exports.createCategory = async (req, res) => {
  try {
    const name = (req.body.name || "").trim();
    if (!name) return error(res, "Kategoriya nomi majburiy");

    // dublikatdan himoya
    const exists = await ExpenseCategory.findOne({ name: new RegExp(`^${name}$`, "i") });
    if (exists) return error(res, "Bu kategoriya allaqachon mavjud");

    const cat = await ExpenseCategory.create({ name, icon: req.body.icon, color: req.body.color });
    return success(res, "Kategoriya qo‘shildi", cat);
  } catch (err) {
    return error(res, "Kategoriya yaratishda xatolik", err.message);
  }
};

// GET /api/expense-categories
exports.getCategories = async (_req, res) => {
  try {
    const list = await ExpenseCategory.find({}).sort({ name: 1 });
    return success(res, "Kategoriyalar", list);
  } catch (err) {
    return error(res, "Kategoriyalarni olishda xatolik", err.message);
  }
};

// DELETE /api/expense-categories/:id
exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await ExpenseCategory.findByIdAndDelete(req.params.id);
    if (!deleted) return notFound(res, "Kategoriya topilmadi");
    return success(res, "Kategoriya o‘chirildi", deleted);
  } catch (err) {
    return error(res, "Kategoriya o‘chirishda xatolik", err.message);
  }
};

// PATCH /api/expense-categories/:id
exports.updateCategory = async (req, res) => {
  try {
    const payload = {};
    if (req.body.name) payload.name = req.body.name.trim();
    if (req.body.icon !== undefined) payload.icon = req.body.icon;
    if (req.body.color !== undefined) payload.color = req.body.color;
    if (req.body.isActive !== undefined) payload.isActive = req.body.isActive;

    if (payload.name) {
      const exists = await ExpenseCategory.findOne({
        _id: { $ne: req.params.id },
        name: new RegExp(`^${payload.name}$`, "i"),
      });
      if (exists) return error(res, "Bu nomdagi kategoriya bor");
    }

    const updated = await ExpenseCategory.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true }
    );
    if (!updated) return notFound(res, "Kategoriya topilmadi");

    return success(res, "Kategoriya yangilandi", updated);
  } catch (err) {
    return error(res, "Kategoriya yangilashda xatolik", err.message);
  }
};
