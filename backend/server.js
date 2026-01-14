const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 1. Add this near the top (with other requires)
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');


const app = express();
app.use(cors());
app.use(express.json()); // To understand JSON data
app.use('/api/auth', authRoutes);

// 2. Basic Route to check if Server is working
app.get('/', (req, res) => {
    res.send("Medicamp Backend is Running!");
});

// 3. Connect to MongoDB (We will add the link later)
// Replace your old connection code with this to see errors clearly
mongoose.connect('mongodb://127.0.0.1:27017/medicamp_db')
    .then(() => console.log("Success: Connected to MongoDB Database!"))
    .catch((err) => console.error("Error: Could not connect to MongoDB ->", err));
    

// 4. Add this near the bottom (before app.listen)
app.use('/api/patients', patientRoutes);

// This MUST be at the very bottom of server.js
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});