const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const auth = require('../middleware/auth'); // Secure it!

// 1. GET ALL
router.get('/', auth, async (req, res) => {
    try {
        const items = await Inventory.find().sort({ quantity: 1 }); // Low stock first
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. ADD ITEM
router.post('/add', auth, async (req, res) => {
    const newItem = new Inventory({
        itemName: req.body.itemName,
        category: req.body.category,
        quantity: req.body.quantity,
        dailyUsage: req.body.dailyUsage
    });
    try {
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 3. DELETE ITEM
router.delete('/:id', auth, async (req, res) => {
    try {
        await Inventory.findByIdAndDelete(req.params.id);
        res.json({ message: "Item Deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;