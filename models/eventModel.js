const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Event title is required.'],
        trim: true,
        minlength: [3, 'Title must be at least 3 characters long.'],
        maxlength: [100, 'Title cannot exceed 100 characters.']
    },
    description: {
        type: String,
        required: [true, 'Event description is required.'],
        trim: true,
        minlength: [10, 'Description must be at least 10 characters long.']
    },
    date: {
        type: Date,
        required: [true, 'Event date is required.']
    },
    location: {
        type: String,
        required: [true, 'Event location is required.'],
        trim: true
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    capacity: {
        type: Number,
        min: [1, 'Capacity must be at least 1.'],
        required: [true, 'Event capacity is required.']       
    },
    status: {
        type: String,
        enum: {
            values: ["scheduled", "cancelled", "completed"],
            message: '{VALUE} is not a valid status. Status must be one of "scheduled", "cancelled", or "completed".'
        },
        default: "scheduled"
    }
}, { timestamps: true });

// Pre-save hook to add 'organizer' to the 'attendees' list if not already present
eventSchema.pre('save', function(next) {
    if (this.organizer && !this.attendees.includes(this.organizer)) {
        this.attendees.push(this.organizer);
    }
    next();
});

module.exports = mongoose.model("Event", eventSchema);