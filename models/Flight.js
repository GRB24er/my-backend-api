const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    aircraftName: { type: String, required: true },
    aircraftModel: { type: String, required: true },
    manufacturer: { type: String, required: true },
    registrationNumber: { type: String, required: true, unique: true },
    category: { type: String, enum: ['light-jet', 'midsize-jet', 'super-midsize', 'heavy-jet', 'ultra-long-range'], required: true },
    passengerCapacity: { type: Number, required: true },
    hourlyRate: { type: Number, required: true },
    maxRange: { type: Number, required: true },
    maxSpeed: { type: Number, required: true },
    features: [String],
    images: [{ url: String, isMainImage: Boolean }],
    description: String,
    isAvailable: { type: Boolean, default: true },
    averageRating: { type: Number, default: 0 },
    totalBookings: { type: Number, default: 0 },
    homeBase: {
        airport: String,
        city: String,
        country: String
    }
}, { timestamps: true });

flightSchema.index({ category: 1, isAvailable: 1, hourlyRate: 1 });

module.exports = mongoose.model('Flight', flightSchema);