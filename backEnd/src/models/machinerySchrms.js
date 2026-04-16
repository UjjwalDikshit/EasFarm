const mongoose = require("mongoose");

const toolsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },

    category: {
      type: String,
      enum: ["Tractor", "Plough", "Harvester", "Other", "Dozer", "Loader"],
      required: true,
    },

    available: { type: Boolean, default: true },

    rentPrice: { type: Number },
    rentUnit: {
      type: String,
      enum: ["per_day", "per_hour"],
      default: "per_day",
    },

    //  RELATION FIXED
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "farmer",
      required: true,
    },

    //  CHAT SNAPSHOT (for fast frontend access)
    chat: {
      chatUserId: String,
      displayName: String,
      isChatUser: Boolean,
      uniqueId: String,
    },
    image: {
      url: { type: String },
      public_id: { type: String }, // REQUIRED for delete
    },
    rating: { type: Number, min: 0, max: 5, default: 0 },

    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "farmer" },
        comment: String,
        rating: { type: Number, min: 0, max: 5 },
      },
    ],

    isFeatured: { type: Boolean, default: false },

    //  GEO SUPPORT (IMPORTANT for your geo query)
    location: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true },
    },
  },
  { timestamps: true },
);

toolsSchema.index({ category: 1 });
toolsSchema.index({ location: "2dsphere" }); //  REQUIRED for geo search

const tools = mongoose.model("tools", toolsSchema);

// =======================
module.exports = { tools };
