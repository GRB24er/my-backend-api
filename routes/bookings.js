const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const { protect } = require('../middleware/auth');

router.post('/', protect, async (req, res) => {
    try {
        const { flightId, departure, arrival, numberOfPassengers, passengers } = req.body;
        
        const flight = await Flight.findById(flightId);
        if (!flight || !flight.isAvailable) {
            return res.status(400).json({ success: false, message: 'Flight not available' });
        }
        
        const totalAmount = flight.hourlyRate * 2; // Basic calculation
        
        const booking = await Booking.create({
            user: req.user._id,
            flight: flightId,
            departure,
            arrival,
            numberOfPassengers,
            passengers,
            totalAmount
        });
        
        await booking.populate('flight', 'aircraftName aircraftModel');
        
        res.status(201).json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/', protect, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('flight', 'aircraftName aircraftModel images')
            .sort({ createdAt: -1 });
        
        res.json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/history', protect, async (req, res) => {
    try {
        const history = await Booking.find({ user: req.user._id, status: 'completed' })
            .populate('flight')
            .sort({ 'departure.date': -1 });
        
        res.json({ success: true, data: history });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;