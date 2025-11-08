const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.get('/profile', protect, async (req, res) => {
    res.json({ success: true, data: req.user.toSafeObject() });
});

router.put('/profile', protect, async (req, res) => {
    try {
        const { firstName, lastName, phone } = req.body;
        
        if (firstName) req.user.firstName = firstName;
        if (lastName) req.user.lastName = lastName;
        if (phone) req.user.phone = phone;
        
        await req.user.save();
        
        res.json({ success: true, data: req.user.toSafeObject() });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;