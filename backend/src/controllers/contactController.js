const Contact = require("../models/Contact");

// Create a new contact
const createContact = async (req, res) => {
  try {
    const { name, permanentId, phone, email, address } = req.body;

    if (!name || !permanentId) {
      return res.status(400).json({
        success: false,
        message: "Name and Permanent ID are required.",
      });
    }

    const contact = await Contact.create({
      name: name.trim(),
      permanentId: permanentId.trim(),
      phone,
      email,
      address,
    });

    res.status(201).json({
      success: true,
      message: "Contact created successfully.",
      contact,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A contact with this Permanent ID already exists.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while creating contact.",
    });
  }
};

// Get all contacts
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching contacts.",
    });
  }
};

// Update a contact
const updateContact = async (req, res) => {
  try {
    const { name, permanentId, phone, email, address } = req.body;

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found.",
      });
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty.",
        });
      }
      contact.name = name.trim();
    }

    if (permanentId !== undefined) {
      if (!permanentId.trim()) {
        return res.status(400).json({
          success: false,
          message: "Permanent ID cannot be empty.",
        });
      }
      contact.permanentId = permanentId.trim();
    }

    if (phone !== undefined) contact.phone = phone;
    if (email !== undefined) contact.email = email;
    if (address !== undefined) contact.address = address;

    const updatedContact = await contact.save();

    res.status(200).json({
      success: true,
      message: "Contact updated successfully.",
      contact: updatedContact,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A contact with this Permanent ID already exists.",
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid contact ID.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while updating contact.",
    });
  }
};

// Delete a contact
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully.",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid contact ID.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while deleting contact.",
    });
  }
};

module.exports = {
  createContact,
  getContacts,
  updateContact,
  deleteContact,
};