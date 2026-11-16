
const Campaign = require("../models/Campaign");
const Event = require("../models/Event");
const Contact = require("../models/Contact");

// CREATE CAMPAIGN
const createCampaign = async (req, res) => {
  try {
    const {
      name,
      eventId,
      channel,
      audience,
      selectedContacts,
      message,
      status,
      scheduledDate,
      scheduledTime,
    } = req.body;

    if (!name || !eventId || !message) {
      return res.status(400).json({
        success: false,
        message: "Campaign name, event and message are required.",
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Selected event was not found.",
      });
    }

    const contactIds = selectedContacts || [];

    if (!Array.isArray(contactIds)) {
      return res.status(400).json({
        success: false,
        message: "Selected contacts must be an array.",
      });
    }

    if (contactIds.length > 0) {
      const existingContacts = await Contact.countDocuments({
        _id: { $in: contactIds },
      });

      if (existingContacts !== contactIds.length) {
        return res.status(400).json({
          success: false,
          message: "One or more selected contacts were not found.",
        });
      }
    }

    const campaignStatus = status || "Draft";

    if (!["Draft", "Scheduled"].includes(campaignStatus)) {
      return res.status(400).json({
        success: false,
        message: "Only Draft and Scheduled campaigns can be created.",
      });
    }

    if (
      campaignStatus === "Scheduled" &&
      (!scheduledDate || !scheduledTime)
    ) {
      return res.status(400).json({
        success: false,
        message: "Scheduled campaigns require a date and time.",
      });
    }

    const campaign = await Campaign.create({
      name,
      eventId,
      eventName: event.name,
      channel: channel || "WhatsApp",
      audience: audience || "all",
      selectedContacts: contactIds,
      recipients: contactIds.length,
      message,
      status: campaignStatus,
      scheduledDate: scheduledDate || "",
      scheduledTime: scheduledTime || "",
    });

    res.status(201).json({
      success: true,
      message: "Campaign created successfully.",
      campaign,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL CAMPAIGNS
const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find()
      .populate("eventId", "name date")
      .populate("selectedContacts", "name permanentId phone email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: campaigns.length,
      campaigns,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE CAMPAIGN
const updateCampaign = async (req, res) => {
  try {
    const {
      name,
      eventId,
      channel,
      audience,
      selectedContacts,
      message,
      status,
      scheduledDate,
      scheduledTime,
    } = req.body;

    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found.",
      });
    }

    if (eventId) {
      const event = await Event.findById(eventId);

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Selected event was not found.",
        });
      }

      campaign.eventId = event._id;
      campaign.eventName = event.name;
    }

    if (selectedContacts !== undefined) {
      if (!Array.isArray(selectedContacts)) {
        return res.status(400).json({
          success: false,
          message: "Selected contacts must be an array.",
        });
      }

      if (selectedContacts.length > 0) {
        const existingContacts = await Contact.countDocuments({
          _id: { $in: selectedContacts },
        });

        if (existingContacts !== selectedContacts.length) {
          return res.status(400).json({
            success: false,
            message: "One or more selected contacts were not found.",
          });
        }
      }

      campaign.selectedContacts = selectedContacts;
      campaign.recipients = selectedContacts.length;
    }

    if (name !== undefined) campaign.name = name;
    if (channel !== undefined) campaign.channel = channel;
    if (audience !== undefined) campaign.audience = audience;
    if (message !== undefined) campaign.message = message;
    if (scheduledDate !== undefined) campaign.scheduledDate = scheduledDate;
    if (scheduledTime !== undefined) campaign.scheduledTime = scheduledTime;

    if (status !== undefined) {
      if (!["Draft", "Scheduled"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Only Draft and Scheduled campaigns can be saved.",
        });
      }

      campaign.status = status;
    }

    if (
      campaign.status === "Scheduled" &&
      (!campaign.scheduledDate || !campaign.scheduledTime)
    ) {
      return res.status(400).json({
        success: false,
        message: "Scheduled campaigns require a date and time.",
      });
    }

    await campaign.save();

    res.status(200).json({
      success: true,
      message: "Campaign updated successfully.",
      campaign,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE CAMPAIGN
const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Campaign deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createCampaign,
  getCampaigns,
  updateCampaign,
  deleteCampaign,
};
