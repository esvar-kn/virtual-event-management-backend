const express = require('express');
const router = express.Router();

// Import the controller and middleware
const eventController = require('../controllers/eventController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// Route to create a new event (requires organizer role)
router.post('/', protect, restrictTo('organizer'), eventController.createEvent);

// Route to list all events (public access)
router.get('/', eventController.listEvents);

// Route to get a specific event by ID (public access)
router.get('/:id', eventController.findEventById);

// Route to update an event by ID (requires organizer role)
router.put('/:id', protect, restrictTo('organizer'), eventController.updateEvent);

// Route to delete an event by ID (requires organizer role)
router.delete('/:id', protect, restrictTo('organizer'), eventController.deleteEvent);

// Route to register for an event (requires authentication)
router.post('/:id/register', protect, eventController.registerForEvent);

// Route to list all registrations for an event (requires organizer role)
router.get('/:id/registrations', protect, restrictTo('organizer'), eventController.listEventAttendees);

module.exports = router;