// 📁 backend/controllers/AuthController.js
const jwt = require("jsonwebtoken");

const users = [
  { username: "admin", password: "admin12345", role: "admin" },
  { username: "seller", password: "seller12345", role: "sotuvchi" },
];

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ state: false, message: "Login yoki parol noto‘g‘ri" });
  }

  const token = jwt.sign({ username: user.username, role: user.role }, "yashirinToken", {
    expiresIn: "30d",
  });

  res.json({
    state: true,
    message: "Kirish muvaffaqiyatli",
    token,
    role: user.role,
  });
};
