// backend/routers/ProductRouter.js
const express = require("express");
const router = express.Router();
const ProductController = require("./controllers/ProductController");
const CategoryController = require("./controllers/CategoryController");
const SaleController = require("./controllers/SaleController");
const DebtController = require("./controllers/DebtController");
const AuthController = require("./controllers/AuthController");
const ctrl = require("./controllers/EmployeeController");
const ExpenseController = require("./controllers/HarajatController");
const ExpenseCategoryController = require("./controllers/harajatcatagoryController");

router.post("/employee/add", ctrl.addEmployee);
router.get("/employee/all", ctrl.getAllEmployees);
router.post("/employee/salary", ctrl.giveSalary);
router.get("/employee/salaryHistory", ctrl.getSalaryHistory);


// 📁 routes/salaryRoutes.js

router.post("/employee/advance", ctrl.giveAdvance);
router.get("/employee/advance/history", ctrl.getAdvanceHistory);
router.get("/employee/advance/:employeeId", ctrl.getSalaryByEmployeeId);


// 📁 routes/employeeRoutes.js yoki salaryRoutes.js



router.post("/expenseAdd", ExpenseController.createExpense);
router.get("/expenseAll", ExpenseController.getAllExpenses);
router.delete("/expenseDelete/:id", ExpenseController.deleteExpense);
router.get("/expenseStats", ExpenseController.getExpenseStats);
router.get("/expenseFilter", ExpenseController.getFilteredExpenses);





router.post("/login", AuthController.login);

router.post("/employee/login", ctrl.login);



router.get("/debtAll", DebtController.getAllDebts);
router.delete("/debtDelete/:id", DebtController.deleteDebt)
router.patch("/payDebt/:id", DebtController.payDebt);
router.post("/payDebtAll", DebtController.payAllDebts);


router.post("/sale/add", SaleController.createSale);
router.get("/sale/all", SaleController.getAllSales);

router.post("/category/add", CategoryController.addCategory);
router.get("/category/all", CategoryController.getAllCategories);
router.delete("/category/delete/:id", CategoryController.deleteCategory);


router.post("/product/add", ProductController.createProduct);
router.get("/product/all", ProductController.getAllProducts);
router.put("/product/update/:id", ProductController.updateProduct);
router.delete("/product/delete/:id", ProductController.deleteProduct);


router.get("/harajatCategoriesAll", ExpenseCategoryController.getCategories);
router.post("/harajatCategoryAddCategory", ExpenseCategoryController.createCategory);

module.exports = router;
