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

    if (existingChat?.length) {
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
    if (chats?.length === 0) {
      return res.status(404).json({
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

exports.deleteChat = async (req, res) => {
  try {
    const { chat_id } = req.body;
    if (!chat_id) {
      return res.status(400).json({
        message: "chat_id is required!",
      });
    }

    const chat = await chatModel.findByIdAndDelete(chat_id);
    if (!chat) {
      return res.status(404).json({
        message: "no chat found!",
      });
    }
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error?.message || error,
    });
  }
};
