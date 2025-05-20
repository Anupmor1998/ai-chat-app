const express = require("express");
const { protect } = require("../controller/authController");
const { createChat, getAllChats } = require("../controller/chatController");

const router = express.Router();

router.post("/add", protect, createChat);
router.get("/all", protect, getAllChats);

module.exports = router;
