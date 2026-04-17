// models/order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "farmer",
      required: true,
    },
    orderType: {
      type: String,
      enum: ["Seed", "Fertiliser", "Pesticide", "ToolRent"],
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SeedsFertilisers",
    },
    tool: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tools",
    },
    quantity: { type: Number, default: 1 },
    price: { type: Number, required: true },
    serviceProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "service_provider", // FIXED
    },
  },
  { timestamps: true }
);

orderSchema.index({ farmer: 1, createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);