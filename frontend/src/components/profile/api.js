import axiosClient from "../../utils/axiosClient";

export const getFarmerProfile = async () => {
  const res = await axiosClient.get("/profile/profile");

  if (!res.data.success) {
    throw new Error(res.data.message);
  }

  return res.data.data; 
};

export const updateFarmerProfile = async (data) => {
  const res = await axiosClient.put("/profile/profile", data);

  if (!res.data.success) {
    throw new Error(res.data.message);
  }

  return res.data.data;
};

export const getMyOrders = async (page = 1) => {
  const res = await axiosClient.get(`/profile/orders?page=${page}`);

  if (!res.data.success) {
    throw new Error(res.data.message);
  }

  return res.data.data;
};