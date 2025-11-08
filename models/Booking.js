const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    flight: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight', required: true },
    bookingNumber: { type: String, unique: true, required: true },
    departure: {
        airport: { type: String, required: true },
        city: String,
        date: { type: Date, required: true },
        time: String
    },
    arrival: {
        airport: { type: String, required: true },
        city: String
    },
    numberOfPassengers: { type: Number, required: true },
    passengers: [{
        firstName: String,
        lastName: String,
        passportNumber: String
    }],
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'completed', 'cancelled'], 
        default: 'pending' 
    },
    paymentStatus: { 
        type: String, 
        enum: ['pending', 'completed', 'failed', 'refunded'], 
        default: 'pending' 
    },
    totalAmount: { type: Number, required: true },
    rating: { type: Number, min: 1, max: 5 },
    review: { comment: String, date: Date }
}, { timestamps: true });

bookingSchema.pre('save', async function(next) {
    if (this.isNew && !this.bookingNumber) {
        const count = await mongoose.model('Booking').countDocuments();
        this.bookingNumber = `ATF${Date.now().toString().slice(-6)}${(count + 1).toString().padStart(4, '0')}`;
    }
    next();
});

module.exports = mongoose.model('Booking', bookingSchema);