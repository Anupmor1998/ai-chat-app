const messageModel = require("../models/messageModel");

exports.createMessage = async (req, res) => {
  try {
    const { content, sender, chat } = req.body;

    if (!content || !sender || !chat) {
      return res.status(400).json({
        message: "all fields are required!",
      });
    }

    const message = new messageModel({
      content,
      sender,
      chat,
    });

    await message.save();

    res.status(201).json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error?.message || error,
    });
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    const { chat_id } = req.body;
    const messages = await messageModel.find({
      chat: chat_id,
    });
    if (messages?.length === 0) {
      return res.status(404).json({
        message: "no messages found!",
      });
    }
    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    return res.status(500).json({
      message: error?.message || error,
    });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { message_id } = req.body;
    if (!message_id) {
      return res.status(400).json({
        message: "message_id is required!",
      });
    }

    const message = await messageModel.findByIdAndDelete(message_id);
    if (!message) {
      return res.status(404).json({
        message: "no message found!",
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
