const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require('../models/Payment');


/* ==========================
   RAZORPAY INSTANCE
========================== */
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ==========================
   CREATE ORDER
========================== */
const create_order =  async (req, res) => {
  try {
    const amount = Number(req.body.amount);

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }
    // console.log("KEY_ID:", process.env.RAZORPAY_KEY_ID);
    // console.log("KEY_SECRET: ", process.env.RAZORPAY_KEY_SECRET);

    const order = await razorpay.orders.create({
      amount,        // in paise
      currency: "INR",
      payment_capture: 1,
    });

    
    // console.log(order.id)
    // console.log(order.amount);

    res.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID, // frontend uses this
    });
  } catch (error) {
    console.error("❌ Create order error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/* ==========================
   VERIFY PAYMENT
========================== */
const verify_payment =  async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    console.log(razorpay_signature);
    // Signature verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    //   console.log(expectedSignature);
    //   console.log(razorpay_signature);

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // Store payment
    await Payment.create({
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
    });

    res.json({
      success: true,
      message: "Payment verified & stored",
      payment_id: razorpay_payment_id,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.json({ success: true, message: "Payment already stored" });
    }
    console.error("❌ Verify payment error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {create_order,verify_payment};