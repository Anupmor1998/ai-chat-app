const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const util = require("util");
const userModal = require("../models/userModel");
const uploadImage = require("../utils/uploadImage");
const convertToBase64 = require("../utils/convertBase64");

const saltRounds = 10;
const asyncSign = util.promisify(jwt.sign);
const asyncVerify = util.promisify(jwt.verify);

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  const file = req.file;

  let userImage = null;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    const isUserPresent = await userModal.findOne({ email });
    if (isUserPresent) {
      return res.status(400).json({
        message: "User already exists!",
      });
    }

    const hashPassword = await bcrypt.hash(password, saltRounds);
    if (file) {
      const base64 = convertToBase64(file);
      userImage = await uploadImage(base64);
    }
    const user = new userModal({
      name,
      email,
      password: hashPassword,
      ...(userImage && { profileImage: userImage }),
    });
    const token = await asyncSign(
      {
        user_id: user?._id,
      },
      process.env.SECRET,
      {
        expiresIn: "1d",
      },
    );
    await user.save();
    res.status(201).json({ success: true, uuid: user.id, token });
  } catch (error) {
    return res.status(500).json({
      message: error?.message || error,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password is required!" });
  }

  try {
    const isUserExists = await userModal.findOne({ email });

    if (!isUserExists) {
      return res.status(404).json({
        message: "user not found!",
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      isUserExists?.password,
    );

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid password!" });
    }
    const token = await asyncSign(
      {
        user_id: isUserExists?._id,
      },
      process.env.SECRET,
      {
        expiresIn: "1d",
      },
    );
    res.status(201).json({
      success: true,
      uuid: isUserExists.id,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: error?.message || error,
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token = null;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(400).json({
        message: "authentication token is required!",
      });
    }
    const result = await asyncVerify(token, process.env.SECRET);
    req.userId = result.user_id;
    next();
  } catch (error) {
    return res.status(500).json({
      message: error?.message || error,
    });
  }
};

exports.userInfo = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModal.findById(userId);
    if (!userId) {
      return res.status(400).json({
        message: "user is not authorized!",
      });
    }
    if (!user) {
      return res.status(404).json({
        message: "user not found!",
      });
    }
    res.status(200).json({
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error?.message || error,
    });
  }
};
