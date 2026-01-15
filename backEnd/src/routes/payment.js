const express = require("express");
const {
  create_order,
  verify_payment,
} = require("../controllers/payment");

const payment_router = express.Router();

payment_router.post("/create-order", create_order);
payment_router.post("/verify-payment", verify_payment);

module.exports = payment_router;
