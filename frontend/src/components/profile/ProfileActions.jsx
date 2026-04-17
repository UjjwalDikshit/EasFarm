import { useNavigate } from "react-router-dom";
import { Pencil, MessageCircle } from "lucide-react";

export default function ProfileActions({ farmer }) {
  const navigate = useNavigate();

  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => navigate("/edit-profile")}
        className="btn btn-primary btn-sm"
      >
        <Pencil size={14} /> Edit Profile
      </button>

      {farmer.chat?.isChatUser && farmer.chat?.chatUserId && (
        <button
          onClick={() => {
            window.open(
              `http://localhost:5173`, 
              "_blank",
            );
          }}
          className="btn btn-outline btn-sm"
        >
          <MessageCircle size={14} /> Open Chat
        </button>
      )}
    </div>
  );
}
