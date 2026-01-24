const redisClient = require("../config/redis");

const toVerifyOtp = async (emailId, otp) => {
  
  console.log(`Inside otpVerify ${emailId} ${otp}`);

  const savedOtp = await redisClient.get(`emailOtp:${emailId}`);

  if (!savedOtp) {
    throw new Error("OTP expired or not found");
  }

  if (savedOtp !== String(otp)) {
    throw new Error(`${savedOtp} ${otp}Invalid OTP`);
  }

  return true;
};


module.exports = toVerifyOtp;
