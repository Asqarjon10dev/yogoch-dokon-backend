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
        dueAmount, // ✅ to‘g‘risi shu
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
  
        // ✅ Ombordagi yetarlilikni tekshirish
        if (product.unit === "kub") {
          if (product.totalKub < item.kub) {
            return response.error(
              res,
              `${product.name} mahsulotidan omborda faqat ${product.totalKub.toFixed(3)} m³ mavjud`
            );
          }
        } else {
          if (product.quantity < item.quantity) {
            return response.error(
              res,
              `${product.name} mahsulotidan omborda faqat ${product.quantity} dona mavjud`
            );
          }
        }
  
        // ✅ Tayyorlanayotgan mahsulot ro'yxatiga qo‘shish
        preparedProducts.push({
          productId: product._id,
          name: product.name,
          code: product.code,
          category: product.category,
          unit: product.unit,
          quantity: item.quantity,
          kub: item.kub || 0,
          price: product.sellPricePerKub,
          currency: product.currency || "so'm",
          cost: product.pricePerKub,
        });
  
        // ✅ Ombordagi miqdorni kamaytirish
        if (product.unit === "kub") {
          product.totalKub -= item.kub;
        } else {
          product.quantity -= item.quantity;
        }
  
        await product.save();
      }
  
      // ✅ Sotuvni saqlash
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
  
      // ✅ Agar qarz bo‘lsa - Debt modelga yozish
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
