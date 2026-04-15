const express = require("express");
const {
  create_order,
  verify_payment,
} = require("../controllers/payment");
const authMiddleware = require("../middlewares/authMiddleware");
const transaction = require("../controllers/transaction");

const payment_router = express.Router();

payment_router.post("/create-order",authMiddleware, create_order);
payment_router.post("/verify-payment",authMiddleware, verify_payment);
payment_router.get("/transaction",authMiddleware,transaction);

module.exports = payment_router;
