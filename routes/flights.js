const express = require('express');
const router = express.Router();
const Flight = require('../models/Flight');

router.get('/', async (req, res) => {
    try {
        const { category, minPassengers, maxHourlyRate, page = 1, limit = 12 } = req.query;
        
        const query = { isAvailable: true };
        if (category) query.category = category;
        if (minPassengers) query.passengerCapacity = { $gte: parseInt(minPassengers) };
        if (maxHourlyRate) query.hourlyRate = { $lte: parseInt(maxHourlyRate) };
        
        const flights = await Flight.find(query)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .sort({ createdAt: -1 });
        
        const total = await Flight.countDocuments(query);
        
        res.json({ success: true, count: flights.length, total, data: flights });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const flight = await Flight.findById(req.params.id);
        if (!flight) {
            return res.status(404).json({ success: false, message: 'Flight not found' });
        }
        res.json({ success: true, data: flight });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;