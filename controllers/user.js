// In controllers/user.js
const User = require("../models/user");
const { setUser } = require('../service/auth');
const bcrypt = require('bcrypt'); 


async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.render("signup", {
      error: "An account with this email already exists. Please login.",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return res.redirect("/login"); 
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.render("login", {
      error: "Invalid email or password. Please try again.",
    });
  }

  const token = setUser(user);
  res.cookie("token", token);
  return res.redirect("/");
}
async function handleUserLogout(req, res) {
  res.clearCookie("token");
  return res.redirect("/login");
}
module.exports = { handleUserSignup, handleUserLogin,handleUserLogout, };