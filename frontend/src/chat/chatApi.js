import axios from "axios";
import axiosClient from "../utils/axiosClient";

// 🔹 Create Chat Account
export const createChatAccount = async ({
  uniqueId,
  displayName,
}) => {
  try {
    const res = await axios.post(
      "http://localhost:5000/user/create",
      {
        name: displayName,
        uniqueId,
      },
      {
        withCredentials: true,
        timeout: 10000, // prevent hanging
      }
    );

    return {
      success: true,
      chatUserId: res.data?.chatUserId,
      data: res.data,
    };
  } catch (err) {
    console.error("Chat Create Error:", err);

    return {
      success: false,
      message:
        err.response?.data?.message ||
        err.message ||
        "Chat service error occurred",
    };
  }
};

//  Update Farmer Chat Info
export const updateFarmerChat = async ({
  chatUserId,
  chatDisplayName,
}) => {
  try {
    const res = await axiosClient.post(
      "/chat/farmer/update-chat",
      {
        chatUserId,
        chatDisplayName,
      },
      {
        withCredentials: true, //   if using cookies
        timeout: 8000,
      }
    );

    return {
      success: true,
      data: res.data,
    };
  } catch (err) {
    console.error("Farmer Update Error:", err);

    return {
      success: false,
      message:
        err.response?.data?.message ||
        err.message ||
        "Failed to update farmer",
    };
  }
};