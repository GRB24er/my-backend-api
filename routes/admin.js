const express = require('express');
const router = express.Router();
const Flight = require('../models/Flight');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/dashboard', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalFlights = await Flight.countDocuments();
        const totalBookings = await Booking.countDocuments();
        
        res.json({
            success: true,
            data: { totalUsers, totalFlights, totalBookings }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/flights', async (req, res) => {
    try {
        const flight = await Flight.create(req.body);
        res.status(201).json({ success: true, data: flight });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;