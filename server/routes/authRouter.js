const express = require("express");
const {
  signup,
  login,
  protect,
  userInfo,
} = require("../controller/authController");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, userInfo);

module.exports = router;
