import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosClient from "../utils/axiosClient";
import { fetchUser } from "../features/authSlice";
import { useDispatch } from "react-redux";

export default function Logout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const hasLoggedOut = useRef(false); // 🛑 StrictMode guard

  useEffect(() => {
    if (hasLoggedOut.current) return;
    hasLoggedOut.current = true;

    const logout = async () => {
      try {
        await axiosClient.post("/user/logout");
        dispatch(fetchUser());

        alert('Logout Successful');
      } catch (err) {
        console.error("Logout error:", err);
        alert(err?.response?.data?.message || "Logout failed");
      } finally {
        const redirectTo = location.state?.from || "/";
        navigate(redirectTo, { replace: true });
      }
    };

    logout();
  }, [navigate, location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <p className="text-lg animate-pulse">Logging you out...</p>
    </div>
  );
}
