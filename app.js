require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const MongoDB_URI = process.env.MONGO_URI;
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoute');
const eventRoutes = require('./routes/eventRoute');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
    res.status(200).send({
        status: "success",
        message: "Welcome to Virtual Event Management Backend",
        documentation: "https://github.com/esvar-kn/virtual-event-management-backend"
    });
});

// User routes
app.use('/api/users', userRoutes);

// Event routes
app.use('/api/events', eventRoutes);

// Connect to MongoDB - Application Bootstrapping
mongoose.connect(MongoDB_URI)
    .then(() => {
        console.log("MongoDB connected");
        // Start the server
        app.listen(port, () => {
            console.log(`Server is listening on ${port}`);
        })
    })
    .catch(err => {
        console.error("MongoDB connection error:", err);
        process.exit(1); 
    });


module.exports = app;