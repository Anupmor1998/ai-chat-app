const chatModel = require("../models/chatModel");

exports.createChat = async (req, res) => {
  try {
    const { name, isGroupChat, participants } = req.body;

    if (!participants || participants?.length === 0) {
      return res.status(400).json({
        message: "participants are required",
      });
    }

    if (participants && participants?.length < 2) {
      return res.status(400).json({
        message: "all participants are required!",
      });
    }

    const existingChat = await chatModel.find({
      isGroupChat: false,
      participants: { $all: [participants[0], participants[1]], $size: 2 },
    });

    if (existingChat) {
      return res.status(400).json({
        message: "chat already exists!",
      });
    }

    const chat = new chatModel({
      participants,
      ...(isGroupChat && { isGroupChat }),
      ...(name && { name }),
    });

    await chat.save();

    res.status(201).json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error?.message || error,
    });
  }
};

exports.getAllChats = async (req, res) => {
  try {
    const chats = await chatModel.find({
      participants: req.userId,
    });
    if (!chats) {
      return res.status(400).json({
        message: "no chats found!",
      });
    }
    res.status(200).json({
      success: true,
      chats,
    });
  } catch (error) {
    return res.status(500).json({
      message: error?.message || error,
    });
  }
};
