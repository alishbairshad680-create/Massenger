const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    eventName: {
      type: String,
      default: "",
    },

    channel: {
      type: String,
      enum: ["SMS", "WhatsApp", "Both"],
      default: "WhatsApp",
    },

    audience: {
      type: String,
      enum: ["all", "selected"],
      default: "all",
    },

    selectedContacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contact",
      },
    ],

    recipients: {
      type: Number,
      default: 0,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Draft", "Scheduled", "Sent"],
      default: "Draft",
    },

    scheduledDate: {
      type: String,
      default: "",
    },

    scheduledTime: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Campaign", campaignSchema);