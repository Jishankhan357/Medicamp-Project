const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

// This route saves a patient to the database
router.post('/add', async (req, res) => {
    try {
        const newPatient = new Patient({
            name: req.body.name,
            age: req.body.age,
            symptoms: req.body.symptoms
        });

        const savedPatient = await newPatient.save();
        res.status(200).json(savedPatient);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;

// This route GETS all patients from the database
router.get('/', async (req, res) => {
    try {
        const patients = await Patient.find(); // Find all patients
        res.status(200).json(patients);      // Send them to the frontend
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// This route DELETES a patient by their specific ID
router.delete('/:id', async (req, res) => {
    try {
        await Patient.findByIdAndDelete(req.params.id);
        res.json({ message: "Patient Deleted Successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});