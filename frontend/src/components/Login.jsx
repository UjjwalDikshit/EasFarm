import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, KeyRound, LogIn } from "lucide-react";
import axiosClient from "../utils/axiosClient";
import {verifyOtpAndLogin} from '../../src/features/authSlice'
import { useDispatch } from "react-redux";

export default function Login() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  // SEND OTP
  const handleClickForOtp = async () => {
    if (!email) return alert("Please enter email");

    try {
      setLoading(true);

      await axiosClient.post("/user/sendOtp", {
        emailId: email,
      });

      alert("OTP sent successfully");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // LOGIN
  const handleClickForLogin = async () => {
    if (!email || !otp) {
      return alert("Email and OTP required");
    }

    try {
      setLoading(true);

    const response = await dispatch(
      verifyOtpAndLogin({ emailId: email, otp:Number(otp) })
    ).unwrap();


      // token is already stored in cookie (httpOnly)
      alert("Login successful");

      const redirect = localStorage.getItem("redirectedAfterLogin");
      localStorage.removeItem("redirectedAfterLogin");

      navigate(redirect || "/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900 via-indigo-900 to-black">
      <div className="relative w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_0_40px_rgba(139,92,246,0.4)]">

        <div className="absolute -top-20 -right-20 w-40 h-40 bg-violet-600 rounded-full blur-3xl opacity-40"></div>

        <h1 className="text-3xl font-bold text-center text-violet-200 mb-8">
          Farmer OTP Login
        </h1>

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm text-violet-300">Email</label>
          <div className="flex items-center gap-2 bg-black/30 rounded-xl px-3 mt-1 border border-white/10">
            <Mail size={18} className="text-violet-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent py-2 outline-none text-white"
              placeholder="farmer@email.com"
            />
          </div>
        </div>

        <button
          onClick={handleClickForOtp}
          disabled={!email || loading}
          className="w-full mb-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 font-semibold disabled:opacity-50"
        >
          Send OTP
        </button>

        {/* OTP */}
        <div className="mb-6">
          <label className="text-sm text-violet-300">OTP</label>
          <div className="flex items-center gap-2 bg-black/30 rounded-xl px-3 mt-1 border border-white/10">
            <KeyRound size={18} className="text-violet-400" />
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full bg-transparent py-2 outline-none text-white"
              placeholder="Enter OTP"
            />
          </div>
        </div>

        <button
          onClick={handleClickForLogin}
          disabled={!otp || loading}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 font-semibold disabled:opacity-50"
        >
          <LogIn size={18} /> Login
        </button>
      </div>
    </div>
  );
}
