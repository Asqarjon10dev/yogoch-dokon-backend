const Sale = require("../models/SaleModels");
const Product = require("../models/ProductModels");
const Debt = require("../models/DebtModels"); // ✅ Qo‘shilgan
const response = require("../utils/response");

class SaleController {
  // 🟢 Sotuvni amalga oshirish
  async createSale(req, res) {
    try {
      const {
        products,
        paymentType,
        paidAmount,
        totalAmount,
        dueAmount,
        dueDate,
        customerName,
        customerPhone,
      } = req.body;

      if (!products || !Array.isArray(products) || products.length === 0) {
        return response.error(res, "Mahsulotlar ro'yxati bo'sh bo'lmasligi kerak");
      }

      const preparedProducts = [];

      for (let item of products) {
        const product = await Product.findById(item.productId);
        if (!product) return response.error(res, `Mahsulot topilmadi: ${item.name}`);

        if (product.quantity < item.quantity) {
          return response.error(res, `${product.name} mahsuloti yetarli emas`);
        }

        let singleUnit = 1;
        if (product.unit === "kub") {
          singleUnit = item.kub || 1;
        } else {
          singleUnit = item.quantity;
        }

        preparedProducts.push({
          productId: product._id,
          name: product.name,
          code: product.code,
          category: product.category,
          unit: product.unit,
          quantity: item.quantity,
          kub: item.kub || 0,
          price: product.sellPrice,
          currency: product.currency || "so'm",
          cost: product.price,
        });

        await Product.updateOne(
          { _id: product._id },
          { $inc: { quantity: -item.quantity } }
        );
      }

      const sale = new Sale({
        products: preparedProducts,
        paymentType,
        paidAmount,
        totalAmount,
        dueAmount,
        dueDate,
        customerName,
        customerPhone,
      });

      await sale.save();

      // ✅ Agar qarz bo‘lsa - Debt modelga yozamiz
      if (dueAmount > 0) {
        const debt = new Debt({
          saleId: sale._id,
          customerName,
          customerPhone,
          debtAmount: dueAmount,
          dueDate,
          status: "qarz",
        });
        await debt.save();
      }
      

      return response.created(res, "✅ Sotuv muvaffaqiyatli qo‘shildi", sale);
    } catch (err) {
      console.error("❌ createSale Error:", err.message);
      return response.serverError(res, "Xatolik yuz berdi");
    }
  }

  // 🟡 Barcha sotuvlarni olish
  async getAllSales(req, res) {
    try {
      const sales = await Sale.find().sort({ createdAt: -1 });
      return response.success(res, "Barcha sotuvlar", sales);
    } catch (err) {
      console.error("getAllSales Error:", err.message);
      return response.serverError(res, "Sotuvlar ro'yxatini olishda xatolik");
    }
  }
}

module.exports = new SaleController();
