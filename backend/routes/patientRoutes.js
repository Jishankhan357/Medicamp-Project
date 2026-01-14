const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const auth = require('../middleware/auth'); // Import the Guard

// 1. GET ALL PATIENTS (Protected)
router.get('/', auth, async (req, res) => {
    try {
        const patients = await Patient.find().sort({ date: -1 });
        res.json(patients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. ADD PATIENT (Protected)
router.post('/add', auth, async (req, res) => {
    const newPatient = new Patient({
        name: req.body.name,
        age: req.body.age,
        symptoms: req.body.symptoms
    });

    try {
        const savedPatient = await newPatient.save();
        res.status(201).json(savedPatient);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 3. DELETE PATIENT (Protected)
router.delete('/:id', auth, async (req, res) => {
    try {
        await Patient.findByIdAndDelete(req.params.id);
        res.json({ message: "Patient Deleted Successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;