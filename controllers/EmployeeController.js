const Employee = require("../models/EmployeeModels");
const SalaryHistory = require("../models/SalaryHistoryModel");
const jwt = require("jsonwebtoken");
const response = require("../utils/response"); // ✅ Asosiy response moduli

// 🟢 Login

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

    const token = jwt.sign({ id: employee._id }, "yashirin", {
      expiresIn: "7d",
    });

    return response.success(res, "Tizimga muvaffaqiyatli kirdingiz", {
      token,
      employeeId: employee._id,
      jobType: employee.jobType, // 🔴 Bu joy juda muhim!
    });
  } catch (err) {
    console.log(err);
    return response.serverError(res, "Serverda xatolik");
  }
};

// 🟢 Ishchi qo‘shish
exports.addEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    return response.created(res, "Ishchi qo‘shildi", employee);
  } catch (err) {
    console.error("❌ Employee yaratishda xatolik:", err.message);

    // 🔍 Agar unikal qiymat (duplicate key) xatosi bo‘lsa
    if (err.code === 11000) {
      const duplicateField = Object.keys(err.keyValue)[0];
      const fieldNameUz = duplicateField === "phone"
        ? "Telefon raqam"
        : duplicateField === "username"
        ? "Login"
        : duplicateField;

      return response.error(
        res,
        `❌ ${fieldNameUz} allaqachon mavjud! Iltimos, boshqa qiymat kiriting.`
      );
    }

    return response.error(res, "Ishchi qo‘shilmadi", err.message);
  }
};




// 🟢 Barcha ishchilarni olish
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    return response.success(res, "Barcha ishchilar", employees);
  } catch (err) {
    return response.serverError(res, "Server xatoligi");
  }
};

// 🟢 Oylik berish
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

// 🟢 Faqat login bo‘lgan ishchining oyliklari
exports.getSalaryByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const salaryList = await Salary.find({ employeeId }).populate("employeeId");

    success(res, salaryList, "Login bo‘lgan ishchining oyliklari");
  } catch (err) {
    console.log(err);
    error(res, "Server xatoligi");
  }
};


// 🟢 Oylik tarixi (Admin yoki Menejer uchun barcha, boshqalar uchun faqat o‘ziki)
exports.getSalaryHistory = async (req, res) => {
    try {
      const all = await SalaryHistory.find().populate("employeeId");
      return response.success(res, "Oylik tarixi", all);
    } catch (err) {
      return response.error(res);
    }
  };
  
