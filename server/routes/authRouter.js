const express = require("express");
const multer = require("multer");
const {
  signup,
  login,
  protect,
  userInfo,
} = require("../controller/authController");
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/signup", upload.single("profileImage"), signup);
router.post("/login", login);
router.get("/me", protect, userInfo);

module.exports = router;
