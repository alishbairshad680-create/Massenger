
const Event = require("../models/Event");

// Create Event
const createEvent = async (req, res) => {
  try {
    const { name, description, date, location, status } = req.body;

    if (!name || !date || !location) {
      return res.status(400).json({
        success: false,
        message: "Name, date and location are required.",
      });
    }

    const eventDate = new Date(date);

    if (Number.isNaN(eventDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid event date.",
      });
    }

    const event = await Event.create({
      name: name.trim(),
      description,
      date: eventDate,
      location: location.trim(),
      status,
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully.",
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while creating event.",
    });
  }
};

// Get All Events
const getEvents = async (req, res) => {
  try {
    const { search, year, status } = req.query;
    const filter = {};

    if (search) {
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { name: { $regex: safeSearch, $options: "i" } },
        { location: { $regex: safeSearch, $options: "i" } },
      ];
    }

    if (year) {
      const selectedYear = Number(year);

      if (!Number.isInteger(selectedYear) || selectedYear < 1900 || selectedYear > 9999) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid year.",
        });
      }

      filter.date = {
        $gte: new Date(`${selectedYear}-01-01T00:00:00.000Z`),
        $lt: new Date(`${selectedYear + 1}-01-01T00:00:00.000Z`),
      };
    }

    if (status) {
      if (!["upcoming", "completed", "cancelled"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid event status.",
        });
      }

      filter.status = status;
    }

    const events = await Event.find(filter).sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching events.",
    });
  }
};

// Get Single Event
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid event ID.",
    });
  }
};

// Update Event
const updateEvent = async (req, res) => {
  try {
    const updates = {};
    const allowedFields = [
      "name",
      "description",
      "date",
      "location",
      "status",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.name !== undefined) {
      if (typeof updates.name !== "string" || !updates.name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Event name cannot be empty.",
        });
      }
      updates.name = updates.name.trim();
    }

    if (updates.location !== undefined) {
      if (typeof updates.location !== "string" || !updates.location.trim()) {
        return res.status(400).json({
          success: false,
          message: "Event location cannot be empty.",
        });
      }
      updates.location = updates.location.trim();
    }

    if (updates.date !== undefined) {
      const eventDate = new Date(updates.date);

      if (Number.isNaN(eventDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid event date.",
        });
      }

      updates.date = eventDate;
    }

    if (
      updates.status !== undefined &&
      !["upcoming", "completed", "cancelled"].includes(updates.status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid event status.",
      });
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event updated successfully.",
      event,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Unable to update event.",
    });
  }
};

// Delete Event
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event deleted successfully.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid event ID.",
    });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
