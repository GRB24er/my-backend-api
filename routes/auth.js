const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone } = req.body;
        
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }
        
        const user = await User.create({ firstName, lastName, email, password, phone });
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        await user.save();
        
        res.status(201).json({
            success: true,
            data: { user: user.toSafeObject(), accessToken, refreshToken }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.lastLogin = Date.now();
        await user.save();
        
        res.json({
            success: true,
            data: { user: user.toSafeObject(), accessToken, refreshToken }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/me', protect, async (req, res) => {
    res.json({ success: true, data: req.user.toSafeObject() });
});

module.exports = router;