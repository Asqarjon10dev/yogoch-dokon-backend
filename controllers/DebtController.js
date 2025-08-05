const Debt = require("../models/DebtModels");
const response = require("../utils/response");

class DebtController {
  // Qarzdorlik qo'shish
  async addDebt(req, res) {
    try {
      const { customerName, customerPhone, debtAmount, dueDate, saleId } = req.body;

      if (!customerName || !customerPhone || !debtAmount) {
        return response.error(res, "Majburiy maydonlar to‘ldirilmagan");
      }

      const newDebt = new Debt({ customerName, customerPhone, debtAmount, dueDate, saleId });
      const saved = await newDebt.save();
      return response.created(res, "Qarzdorlik qo‘shildi", saved);
    } catch (err) {
      console.error("addDebt Error:", err.message);
      return response.serverError(res, "Server xatoligi");
    }
  }

  // Barcha qarzdorlar ro‘yxati
  async getAllDebts(req, res) {
    try {
      const debts = await Debt.find().sort({ createdAt: -1 });
      return response.success(res, "Qarzdorlar ro‘yxati", debts);
    } catch (err) {
      console.error("getAllDebts Error:", err.message);
      return response.serverError(res, "Ro‘yxatni olishda xatolik");
    }
  }

  // Qarzni to‘lash
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
      return response.success(res, "To‘lov bajarildi", updated);
    } catch (err) {
      console.error("payDebt Error:", err.message);
      return response.serverError(res, "To‘lovni amalga oshirishda xatolik");
    }
  }

  async payAllDebts (req, res) {  
    try {
      const { debts } = req.body; // debts - [{ id, amount }, ...]
      if (!Array.isArray(debts) || debts.length === 0) {
        return response.error(res, "To‘lovlar ro‘yxati bo‘sh");
      }

      const results = [];
      for (const { id, amount } of debts) {
        const debt = await Debt.findById(id);
        if (!debt) {
          results.push({ id, status: "not found" });
          continue;
        }

        if (amount <= 0 || isNaN(amount)) {
          results.push({ id, status: "invalid amount" });
          continue;
        }

        if (amount >= debt.debtAmount) {
          debt.debtAmount = 0;
          debt.status = "to‘langan";
        } else {
          debt.debtAmount -= amount;
          debt.status = "qisman to‘langan";
        }

        const updated = await debt.save();
        results.push({ id: updated._id, status: "paid", remaining: updated.debtAmount });
      }

      return response.success(res, "Barcha to‘lovlar bajarildi", results);
    } catch (err) {
      console.error("payAllDebts Error:", err.message);
      return response.serverError(res, "To‘lovlarni amalga oshirishda xatolik");
    }
  }
}

module.exports = new DebtController();
