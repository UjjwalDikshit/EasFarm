import React, { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { useNavigate } from "react-router-dom";


function PaymentButton({ amount }) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();

  
  /* ==========================
     LOAD RAZORPAY SDK
  ========================== */
  useEffect(() => {
    if (window.Razorpay) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => setScriptLoaded(true);
    script.onerror = () => console.error("❌ Razorpay SDK failed to load");

    document.body.appendChild(script);
  }, []);

  /* ==========================
     HANDLE PAYMENT
  ========================== */
  const handlePayment = async () => {
    if (!scriptLoaded || isProcessing) return;

    try{
      const loginStatus = await axiosClient.post('/user/checkLogin');

    }
    catch(err){
      alert('Login Rirst Then Only You Can Make Payment');
      if(!err.response.data.loggedIn){
        localStorage.setItem("redirectedAfterLogin", location.pathname);
        navigate('/login');
        return;
      }
    }

 

    setIsProcessing(true);

    try {
      // ₹ → paise
      const amountInPaise = amount * 100;

      console.log('berfore creating order')
      // 1️⃣ Create Order
      const orderRes = await axiosClient.post(
        "/payment/create-order",
        { amount: amountInPaise }
      );


      const orderData = orderRes.data;

      if (!orderData?.order_id) {
        throw new Error("Order creation failed");
      }

      // 2️⃣ Razorpay options
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: "INR",
        order_id: orderData.order_id,
        name: "EasFarm",
        description: "Tool Rental Payment",

        handler: async (response) => {
          try {
            // 3️⃣ Verify Payment
            const verifyRes = await axiosClient.post(
              "/payment/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            const verifyData = verifyRes.data;

            if (verifyData.success) {
              alert(`✅ Payment Successful\nPayment ID: ${verifyData.payment_id}`);
            } else {
              alert("❌ Payment verification failed");
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Verification failed");
          } finally {
            setIsProcessing(false);
          }
        },

        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },

        theme: {
          color: "#2563eb",
        },

        modal: {
          ondismiss: () => setIsProcessing(false),
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (response) => {
        alert("❌ Payment failed: " + response.error.description);
        setIsProcessing(false);
      });

      // 🔥 OPEN CHECKOUT
      rzp.open();

    } catch (error) {
      
      console.error("Payment error:", error);
      alert(error.response?.data?.message || "Something went wrong");
      setIsProcessing(false);
    }
  };

  /* ==========================
     UI
  ========================== */
  return (
    <button
      onClick={handlePayment}
      disabled={!scriptLoaded || isProcessing}
      className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm disabled:bg-gray-400"
    >
      {isProcessing ? "Processing..." : `Pay ₹${amount}`}
    </button>
  );
}

export default PaymentButton;
