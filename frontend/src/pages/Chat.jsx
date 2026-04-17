import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { createChatAccount, updateFarmerChat } from "../chat/chatApi";
import { Loader2, MessageCircle, AlertCircle } from "lucide-react";
import {useNavigate} from "react-router-dom"

export default function Chat() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const hasOpened = useRef(false); //  prevents multiple tabs

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [uniqueId, setUniqueId] = useState("");

  const [error, setError] = useState("");

  //  OPEN CHAT SAFELY
  const openChatTab = () => {
    if (hasOpened.current) return;

    hasOpened.current = true;

    window.open("http://localhost:5173", "_blank");

    //  redirect current tab to homepage
    navigate("/");
  };

  useEffect(() => {
    //  wait until auth state is known
    if (isAuthenticated === undefined) return;

    //  only redirect if truly not logged in
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }

    setName(user.fullName || "");
    setDisplayName(user.fullName || "");

    //  already chat user → open directly
    if (user?.chat?.chatUserId) {
      openChatTab();
      return;
    }

    setLoading(false);
  }, [user, isAuthenticated]);

  const handleCreate = async () => {
    setError("");

    if (!uniqueId) {
      setError("Unique ID is required");
      return;
    }

    try {
      setCreating(true);

      const res = await createChatAccount({
        uniqueId,
        displayName,
      });

      //  uniqueId taken
      if (!res.success && !res.chatUserId) {
        setError(res.message);
        return;
      }

      //  handle both new + existing
      const chatUserId = res.chatUserId || res.data?.chatUserId;

      const updateRes = await updateFarmerChat({
        chatUserId,
        chatDisplayName: displayName,
        uniqueId
      });

      if (!updateRes.success) {
        setError(updateRes.message);
        return;
      }

      //  OPEN CHAT
      openChatTab();

    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setCreating(false);
      setLoading(false);
    }
  };

  //  Loader
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-base-200">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl p-6 space-y-4">

        <div className="text-center">
          <MessageCircle className="mx-auto text-primary mb-2" size={40} />
          <h2 className="text-xl font-bold">Create Chat Account</h2>
        </div>

        {error && (
          <div className="alert alert-error text-sm">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <input
          className="input input-bordered w-full"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="input input-bordered w-full"
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />

        <input
          className="input input-bordered w-full"
          placeholder="Unique Chat ID"
          value={uniqueId}
          onChange={(e) => setUniqueId(e.target.value)}
        />

        <button
          className={`btn btn-primary w-full ${creating ? "btn-disabled" : ""}`}
          onClick={handleCreate}
        >
          {creating ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Creating...
            </>
          ) : (
            "Create & Continue"
          )}
        </button>

      </div>
    </div>
  );
}