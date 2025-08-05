const Expense = require("../models/HarajatModels.js");
const { success, error, notFound } = require("../utils/response");

// 🟢 1. Xarajat qo‘shish
const createExpense = async (req, res) => {
  try {
    const { amount, reason, category } = req.body;
    if (!amount || !reason || !category) {
      return error(res, "Kategoriya, sabab va summani kiriting");
    }

    const newExpense = new Expense({ amount, reason, category });
    await newExpense.save();

    return success(res, "Xarajat muvaffaqiyatli qo‘shildi", newExpense);
  } catch (err) {
    return error(res, "Xarajat qo‘shishda xatolik", err.message);
  }
};

// 🟢 2. Barcha xarajatlar ro‘yxati
const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    return success(res, "Xarajatlar ro‘yxati", expenses);
  } catch (err) {
    return error(res, "Xarajatlarni olishda xatolik", err.message);
  }
};

// 🟢 3. Xarajatni o‘chirish
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) return notFound(res, "Xarajat topilmadi");

    return success(res, "Xarajat o‘chirildi", expense);
  } catch (err) {
    return error(res, "Xarajatni o‘chirishda xatolik", err.message);
  }
};

// 🟢 4. Sana va kategoriya bo‘yicha filter
const getFilteredExpenses = async (req, res) => {
  try {
    const { from, to, category } = req.query;

    const filter = {};
    if (from && to) {
      filter.createdAt = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    }

    if (category && category !== "Barchasi") {
      filter.category = category;
    }

    const filtered = await Expense.find(filter).sort({ createdAt: -1 });
    return success(res, "Filtrlangan xarajatlar", filtered);
  } catch (err) {
    return error(res, "Filtrlashda xatolik", err.message);
  }
};

// 🟢 5. Kategoriya bo‘yicha statistika
const getExpenseStats = async (req, res) => {
  try {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    const stats = await Expense.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    return success(res, "Kategoriya bo‘yicha xarajatlar statistikasi", stats);
  } catch (err) {
    return error(res, "Statistikani olishda xatolik", err.message);
  }
};

module.exports = {
  createExpense,
  getAllExpenses,
  deleteExpense,
  getFilteredExpenses,
  getExpenseStats,
};