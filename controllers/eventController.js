const eventModel = require('../models/eventModel');
const { sendRegistrationEmail } = require('../utils/emailService');

// Create a new event
const createEvent = async (req, res) => {
    const { title, description, date, location, capacity } = req.body;
    const organizerId = req.user.id; // Assuming user ID is available from the auth middleware

    if (!title || !description || !date || !location || !capacity) {
        return res.status(400).json({ message: "Title, description, date, location, and capacity are required." });
    }

    try {
        const newEvent = await eventModel.create({
            title,
            description,
            date,
            location,
            capacity,
            organizer: organizerId
        });
        res.status(201).json({ message: "Event created successfully.", event: newEvent });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error.", error: error.message });
    }
};

// List all events
const listEvents = async (req, res) => {
    try {
        const events = await eventModel.find({}).populate('organizer', 'name email');
        res.status(200).json({ events });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error.", error: error.message });
    }
};

// Find an event by ID
const findEventById = async (req, res) => {
    const { id } = req.params;

    try {
        const event = await eventModel.findById(id).populate('organizer attendees', 'name email');
        if (!event) {
            return res.status(404).json({ message: "Event not found." });
        }
        res.status(200).json({ event });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error.", error: error.message });
    }
};

// Update an event by ID
const updateEvent = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
       // First, find the existing event document
        const eventToUpdate = await eventModel.findById(id);
        if (!eventToUpdate) {
            return res.status(404).json({ message: "Event not found." });
        }
        for (const key in updateData) {
            // Only update fields that exist on the model to prevent issues
            if (eventToUpdate[key] !== undefined) {
                eventToUpdate[key] = updateData[key];
            }
        }
        const updatedEvent = await eventToUpdate.save();
        res.status(200).json({ message: "Event updated successfully.", event: updatedEvent });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error.", error: error.message });
    }
};

// Delete an event by ID
const deleteEvent = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedEvent = await eventModel.findByIdAndDelete(id);
        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found." });
        }
        res.status(200).json({ message: "Event deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error.", error: error.message });
    }
};

// Register for an event
const registerForEvent = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; // User ID from the JWT payload
    const userEmail = req.user.email; // User email from the JWT payload

    try {
        const event = await eventModel.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found." });
        }
        if (event.attendees.includes(userId)) {
            return res.status(409).json({ message: "You are already registered for this event." });
        }
        if (event.attendees.length >= event.capacity) {
            return res.status(409).json({ message: "Event is at full capacity." });
        }
        
        event.attendees.push(userId);
        await event.save();

        // Implement email notification logic here
        await sendRegistrationEmail(userEmail, event.title);
        
        res.status(200).json({ message: "Successfully registered for the event." });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error.", error: error.message });
    }
};

// List all attendees for an event
const listEventAttendees = async (req, res) => {
    const { id } = req.params;

    try {
        const event = await eventModel.findById(id).populate('attendees', 'name email');
        if (!event) {
            return res.status(404).json({ message: "Event not found." });
        }
        res.status(200).json({ attendees: event.attendees });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error.", error: error.message });
    }
};

module.exports = {
    createEvent,
    listEvents,
    findEventById,
    updateEvent,
    deleteEvent,
    registerForEvent,
    listEventAttendees
};