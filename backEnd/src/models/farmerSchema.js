const mongoose = require('mongoose');
const { service_provider } = require('./machinerySchrms');

const farmerSchema = new mongoose.Schema({

    // Mandatory fields
    fullName: {
        type: String,
        required: [true, 'Full name is required'], // this include custom error message if field is missing then mongoose will send.
        trim: true,
    },
    mobileNumber: {
        type: String,
        required: [true, 'Mobile number is required'],
        unique: true, // prevent duplicate registrations
        match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit mobile number'],
    },
    password: {
        type: String,
        required: [true, 'Password/PIN is required'],

    },
    villageOrCity: {
        type: String,
        required: [true, 'Village or city is required'],
        trim: true,
    },
    district: {
        type: String,
        required: [true, 'District is required'],
        trim: true,
    },
    state: {
        type: String,
        required: [true, 'State is required'],
        trim: true,
    },
    pincode: {
        type: String,
        required: [true, 'Pincode is required'],
        match: [/^[0-9]{6}$/, 'Please provide a valid 6-digit pincode'],
    },

    // Optional fields
    alternateMobile: {
        type: String,
        required: false,
        match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit mobile number'],
    },
    gpsLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
            required: true
        },
        coordinates: {
            type: [Number],
            required: true,
            index: '2dsphere'
        }
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        immutable: true,
    },
    allowDataSharing: {
        type: Boolean,
        required: false,
        default: false,
    },
    myOrders: [
        {
            orderType: {
                type: String,
                enum: ["Seed", "Fertiliser", "Pesticide", "ToolRent"],
                required: true
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "SeedsFertilisers"  // link to seed/fertiliser collection
            },
            tool: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "tools"  // link to tools collection if rented
            },
            quantity: { type: Number, default: 1 },
            price: { type: Number, required: true }, // final price paid after discount
            serviceProvider: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "service-provider",
                required: true
            },
            purchasedAt: { type: Date, default: Date.now }
        }
    ],
    role: {
        type: String,
        enum: ['farmer', 'serprovider', 'admin'],
        default: 'farmer'
    },

    // Consent - must be true
    acceptTerms: {
        type: Boolean,
        required: [true, 'Accepting Terms & Conditions is required'],
        validate: {
            validator: function(value) {
                return value === true;
            },
            message: 'You must accept the Terms & Conditions to register',
        },
    },
}, { timestamps: true });

farmerSchema.index({ gpsLocation: "2dsphere" });


const farmers = mongoose.model('farmer', farmerSchema);
module.exports = farmers;