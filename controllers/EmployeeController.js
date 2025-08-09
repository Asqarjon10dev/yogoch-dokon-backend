// backend/controllers/EmployeeController.js
const Employee = require("../models/EmployeeModels");
const SalaryHistory = require("../models/SalaryHistoryModel");
const AdvanceHistory = require("../models/AdvanceHistoryModel"); // avans tarixi uchun model bo‘lishi kerak
const jwt = require("jsonwebtoken");
const response = require("../utils/response"); 

/* ===========================
   🟢 Login
=========================== */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const employee = await Employee.findOne({ username });
    if (!employee) {
      return response.notFound(res, "Foydalanuvchi topilmadi");
    }

    if (employee.password !== password) {
      return response.error(res, "Parol noto‘g‘ri");
    }

    const token = jwt.sign({ id: employee._id }, "yashirin", { expiresIn: "7d" });

    return response.success(res, "Tizimga muvaffaqiyatli kirdingiz", {
      token,
      employeeId: employee._id,
      jobType: employee.jobType,
    });
  } catch (err) {
    console.log(err);
    return response.serverError(res, "Serverda xatolik");
  }
};

/* ===========================
   🟢 Ishchi qo‘shish
=========================== */
exports.addEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    return response.created(res, "Ishchi qo‘shildi", employee);
  } catch (err) {
    console.error("❌ Employee yaratishda xatolik:", err.message);
    if (err.code === 11000) {
      const duplicateField = Object.keys(err.keyValue)[0];
      const fieldNameUz =
        duplicateField === "phone" ? "Telefon raqam" :
        duplicateField === "username" ? "Login" :
        duplicateField;

      return response.error(res, `${fieldNameUz} allaqachon mavjud!`);
    }
    return response.error(res, "Ishchi qo‘shilmadi", err.message);
  }
};

/* ===========================
   🟢 Barcha ishchilarni olish
=========================== */
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    return response.success(res, "Barcha ishchilar", employees);
  } catch (err) {
    return response.serverError(res, "Server xatoligi");
  }
};

/* ===========================
   🟢 Oylik berish
=========================== */
exports.giveSalary = async (req, res) => {
  try {
    const { employeeId, amount } = req.body;
    const employee = await Employee.findById(employeeId);
    if (!employee) return response.notFound(res, "Ishchi topilmadi");

    const history = await SalaryHistory.create({ employeeId, amount });
    return response.success(res, "Oylik berildi", history);
  } catch (err) {
    return response.error(res, "Oylik berishda xatolik", err.message);
  }
};

/* ===========================
   🟢 Faqat bitta ishchining oyliklari
=========================== */
exports.getSalaryByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const salaryList = await SalaryHistory.find({ employeeId }).populate("employeeId");
    return response.success(res, "Ishchi oyliklari", salaryList);
  } catch (err) {
    console.log(err);
    return response.serverError(res, "Server xatoligi");
  }
};

/* ===========================
   🟢 Oylik tarixi (barcha ishchilar)
=========================== */
exports.getSalaryHistory = async (req, res) => {
  try {
    const all = await SalaryHistory.find().populate("employeeId");
    return response.success(res, "Oylik tarixi", all);
  } catch (err) {
    return response.serverError(res, "Oylik tarixini olishda xatolik");
  }
};

/* ===========================
   🟢 Avans berish
=========================== */
exports.giveAdvance = async (req, res) => {
  try {
    const { employeeId, amount } = req.body;
    const employee = await Employee.findById(employeeId);
    if (!employee) return response.notFound(res, "Ishchi topilmadi");

    const advance = await AdvanceHistory.create({ employeeId, amount });
    return response.success(res, "Avans berildi", advance);
  } catch (err) {
    return response.error(res, "Avans berishda xatolik", err.message);
  }
};

/* ===========================
   🟢 Avans tarixi (barcha ishchilar)
=========================== */
exports.getAdvanceHistory = async (req, res) => {
  try {
    const all = await AdvanceHistory.find().populate("employeeId");
    return response.success(res, "Avans tarixi", all);
  } catch (err) {
    return response.serverError(res, "Avans tarixini olishda xatolik");
  }
};
