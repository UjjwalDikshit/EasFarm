
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order_id: String,
  customer:String,
  payment_id: { type: String, unique: true },
  status: { type: String, default: "paid" },
  createdAt: { type: Date, default: Date.now },
});

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;