const mongoose = require("mongoose");

const schemeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    }, // "PM-Kisan Samman Nidhi"

    shortTitle: {
      type: String,
    }, // optional short name e.g., "PM-Kisan"

    description: {
      type: String,
      required: true,
    }, // detailed scheme info

    category: {
      type: String,
      enum: ["Subsidy", "Loan", "Insurance", "Training", "Grant", "Other"],
      required: true,
    }, // classification

    department: {
      type: String,
    }, // issuing ministry/department e.g., "Ministry of Agriculture"

    eligibility: [
      {
        type: String,
      },
    ], // e.g. ["Small/Marginal Farmers", "Women Farmers"]

    documentsRequired: [
      {
        type: String,
      },
    ], // ["Aadhar", "Bank Passbook", "Land Record"]

    benefits: [
      {
        type: String,
      },
    ], // ["₹6000/year income support", "0% loan interest till 1 year"]

    howToApply: {
      type: String,
    }, // "Apply online via official portal" or "Visit nearest CSC center"

    applicationLink: {
      type: String,
    }, // official government portal link

    helpline: {
      phone: String,
      email: String,
    }, // support contact

    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    }, // for expired/closed schemes

    region: {
      type: [String],
      default: ["All India"],
    }, // applicable states/UTs e.g., ["Uttar Pradesh", "Maharashtra"]

    language: {
      type: String,
      enum: ["English", "Hindi", "Urdu", "Kashmiri"],
      default: "English",
    },

    lastUpdated: {
      type: Date,
      default: Date.now,
    },

    // Engagement & trust
    views: { type: Number, default: 0 },
    saves: { type: Number, default: 0 }, // how many farmers saved/bookmarked this
    shares: { type: Number, default: 0 },

    verified: { type: Boolean, default: false }, // verified by admin before showing

    tags: [{ type: String }], // ["PM-Kisan", "Subsidy", "Crop Insurance"]
  },
  { timestamps: true },
);

module.exports = mongoose.model("Scheme", schemeSchema);

/**
 * 
    {
        "title": "PM-Kisan Samman Nidhi",
        "shortTitle": "PM-Kisan",
        "description": "Provides income support of ₹6000 per year to eligible farmers.",
        "category": "Subsidy",
        "department": "Ministry of Agriculture & Farmers Welfare",
        "eligibility": ["Small Farmers", "Marginal Farmers"],
        "documentsRequired": ["Aadhar Card", "Bank Account Passbook", "Land Ownership Proof"],
        "benefits": ["₹6000 per year in 3 installments", "Direct Bank Transfer"],
        "howToApply": "Apply online at PM-Kisan portal or visit nearest CSC center.",
        "applicationLink": "https://pmkisan.gov.in",
        "helpline": {
            "phone": "1800-180-1551",
            "email": "pmkisan-ict@gov.in"
        },
        "startDate": "2019-02-24",
        "region": ["All India"],
        "language": "English",
        "tags": ["Income Support", "PM-Kisan", "Subsidy"],
        "verified": true
    }

 */
