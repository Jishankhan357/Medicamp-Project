const mongoose = require('mongoose');

// This is the blueprint of a Patient's record
const PatientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    symptoms: {
        type: String,
        required: true // This will store the data from our Voice-to-Text later!
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Patient', PatientSchema);