const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        trim: true,
        minlength: [3, 'Name must be at least 3 characters long.'],
        maxlength: [50, 'Name cannot exceed 50 characters.']
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address.']
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        minlength: [6, 'Password must be at least 6 characters long.']
    },
    role: {
        type: String,
        enum: {
            values: ["attendee", "organizer"],
            message: '{VALUE} is not a valid role. Role must be "attendee" or "organizer".'
        },
        default: "attendee",
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);