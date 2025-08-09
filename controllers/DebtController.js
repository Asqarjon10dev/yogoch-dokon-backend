const Debt = require("../models/DebtModels");
const response = require("../utils/response");

class DebtController {
  // 🔹 Barcha qarzdorlar ro‘yxatini olish
// DebtController.js
async getAllDebts(req, res) {
  try {
    const debts = await Debt.find({
      debtAmount: { $gt: 0 },                 // ✅ 0 dan katta bo‘lsin
      // yoki: status: { $in: ["qarz", "qisman to‘langan"] }
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "saleId",
        select: "products totalAmount createdAt customerName customerPhone",
      })
      .lean();

    return response.success(res, "Qarzdorlar ro‘yxati", debts);
  } catch (e) {
    return response.serverError(res, "Qarzdorlarni olishda xatolik");
  }
}


  // 🔹 Qarzdorlikni o‘chirish
  async deleteDebt(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Debt.findByIdAndDelete(id);
      if (!deleted) return response.notFound(res, "Qarzdor topilmadi");
      return response.success(res, "Qarzdor o‘chirildi", deleted);
    } catch (err) {
      console.error("deleteDebt Error:", err.message);
      return response.serverError(res, "Qarzdorni o‘chirishda xatolik");
    }
  }

  // 🔹 Bitta qarzni to‘lash
  async payDebt(req, res) {
    try {
      const { id } = req.params;
      const { amount } = req.body;

      if (!amount || isNaN(amount) || amount <= 0) {
        return response.error(res, "To‘lov miqdori noto‘g‘ri");
      }

      const debt = await Debt.findById(id);
      if (!debt) return response.notFound(res, "Qarzdor topilmadi");

      if (amount >= debt.debtAmount) {
        debt.debtAmount = 0;
        debt.status = "to‘langan";
      } else {
        debt.debtAmount -= amount;
        debt.status = "qisman to‘langan";
      }

      const updated = await debt.save();
      return response.success(res, "To‘lov muvaffaqiyatli bajarildi", updated);
    } catch (err) {
      console.error("payDebt Error:", err.message);
      return response.serverError(res, "To‘lovni amalga oshirishda xatolik");
    }
  }

  // 🔹 Bir nechta qarzlarni bulk to‘lash
  async payAllDebts(req, res) {
    try {
      const { debtIds } = req.body;

      if (!Array.isArray(debtIds) || debtIds.length === 0) {
        return response.error(res, "Qarzlar ro‘yxati bo‘sh");
      }

      const results = [];

      for (const id of debtIds) {
        const debt = await Debt.findById(id);
        if (!debt) {
          results.push({ id, status: "topilmadi" });
          continue;
        }

        debt.debtAmount = 0;
        debt.status = "to‘langan";

        const updated = await debt.save();
        results.push({ id: updated._id, status: "to‘landi" });
      }

      return response.success(res, "Barcha qarzlar to‘landi", results);
    } catch (err) {
      console.error("payAllDebts Error:", err.message);
      return response.serverError(res, "Bulk to‘lovda xatolik");
    }
  }
}

module.exports = new DebtController();
