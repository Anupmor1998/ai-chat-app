const express = require("express");
const { protect } = require("../controller/authController");
const {
  createChat,
  getAllChats,
  deleteChat,
} = require("../controller/chatController");

const router = express.Router();

router.post("/add", protect, createChat);
router.get("/all", protect, getAllChats);
router.delete("/delete", protect, deleteChat);

module.exports = router;
