const express = require("express");
const jwt = require("jsonwebtoken");
const util = require("util");
const userModal = require("../models/userModal");
const router = express.Router();

const asyncSign = util.promisify(jwt.sign);

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const isUserPresent = await userModal.findOne({ email });
  if (isUserPresent) {
    return res.status(400).json({
      message: "User already exists!",
    });
  }
  const user = new userModal({
    name,
    email,
    password,
  });

  try {
    await user.save();
    const token = await asyncSign(
      {
        user_id: user?._id,
      },
      process.env.SECRET,
      {
        expiresIn: "1d",
      },
    );
    res.status(201).json({
      user,
      token,
      message: "User signed up successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: error?.message || error,
    });
  }
});

module.exports = router;
