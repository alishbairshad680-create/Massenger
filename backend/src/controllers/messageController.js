
const Message = require("../models/Message");

// Create a message log
const createMessage = async (req, res) => {
  try {
    const {
      recipient,
      phone,
      channel,
      campaignId,
      campaign,
      message,
      status,
    } = req.body;

    if (!recipient || !channel || !message) {
      return res.status(400).json({
        success: false,
        message: "Recipient, channel, and message are required.",
      });
    }

    const newMessage = await Message.create({
      recipient,
      phone,
      channel,
      campaignId: campaignId || null,
      campaign: campaign || "",
      message,
      status: status || "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Message log saved successfully.",
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all message logs
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .populate("campaignId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a message log
const deleteMessage = async (req, res) => {
  try {
    const deletedMessage = await Message.findByIdAndDelete(req.params.id);

    if (!deletedMessage) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Message deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createMessage,
  getMessages,
  deleteMessage,
};
