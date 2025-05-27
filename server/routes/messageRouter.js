const express = require("express");
const { protect } = require("../controller/authController");
const {
  createMessage,
  getAllMessages,
  deleteMessage,
} = require("../controller/messageController");

const router = express.Router();

router.post("/add", protect, createMessage);
router.get("/all", protect, getAllMessages);
router.delete("/delete", protect, deleteMessage);

module.exports = router;
