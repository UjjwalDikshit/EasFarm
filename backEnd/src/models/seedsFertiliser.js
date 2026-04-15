const mongoose = require('mongoose');

const seedsFertiliserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, enum: ["Seed", "Fertiliser", "Pesticide"], required: true },

    brand: { type: String, required: true },
    manufacturer: { type: String },
    batchNumber: { type: String },
    certification: { type: String },
    isOrganic: { type: Boolean, default: false },

    description: { type: String },
    image: { type: String },

    weight: { type: Number },
    weightUnit: { type: String, enum: ["kg", "g", "litre", "ml", "packet"], default: "kg" },
    packagingType: { type: String },
    stockQuantity: { type: Number, default: 0, required: true },

    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },

    manufactureDate: { type: Date },
    expiryDate: { type: Date },
    storageInstructions: { type: String },
    usageInstructions: { type: String },
    safetyInfo: { type: String },

    seller: {
        name: { type: String, required: true },
        contact: { type: String, required: true },
        farmer: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "farmer", 
            required: true 
        }
    },

    chat: {
        chatUserId: String,
        displayName: String,
        isChatUser: Boolean,
        uniqueId: String
    },

    rating: { type: Number, min: 0, max: 5, default: 0 },

    reviews: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: "farmer" },
        comment: String,
        rating: { type: Number, min: 0, max: 5 }
    }],

    stockAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },

}, { timestamps: true });

const s_and_f = mongoose.model('SeedsFertilisers', seedsFertiliserSchema);

module.exports = { s_and_f };