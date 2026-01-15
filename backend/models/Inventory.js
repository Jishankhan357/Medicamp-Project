const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    category: { type: String, required: true }, // e.g., "Medicine", "Equipment"
    quantity: { type: Number, required: true },
    dailyUsage: { type: Number, required: true }, // The "AI" Variable
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inventory', InventorySchema);