const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 8, select: false },
    phone: { type: String, required: true },
    role: { type: String, enum: ['user', 'vip', 'admin'], default: 'user' },
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    avatar: { type: String, default: 'https://via.placeholder.com/200' },
    loyaltyPoints: { type: Number, default: 0 },
    membershipTier: { type: String, enum: ['bronze', 'silver', 'gold', 'platinum'], default: 'bronze' },
    totalFlightsBooked: { type: Number, default: 0 },
    totalAmountSpent: { type: Number, default: 0 },
    preferences: {
        mealPreference: { type: String, default: 'no-preference' },
        seatPreference: { type: String, default: 'no-preference' }
    },
    refreshTokens: [{ token: String, createdAt: { type: Date, default: Date.now } }],
    lastLogin: Date
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function() {
    return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

userSchema.methods.generateRefreshToken = function() {
    const token = jwt.sign({ id: this._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
    this.refreshTokens.push({ token });
    return token;
};

userSchema.methods.toSafeObject = function() {
    const obj = this.toObject();
    delete obj.password;
    delete obj.refreshTokens;
    return obj;
};

module.exports = mongoose.model('User', userSchema);