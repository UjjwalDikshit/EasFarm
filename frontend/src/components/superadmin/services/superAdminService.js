// services/superAdminService.js
import axiosClient from "../../../utils/axiosClient";

export const getAdmins = () => axiosClient.get("/superadmin/admins");
// MAKE ADMIN 
export const makeAdmin = (email) =>
  axiosClient.put("/superadmin/make-admin", { email });

// REMOVE ADMIN 
export const removeAdmin = (userId) =>
  axiosClient.put(`/superadmin/remove-admin/${userId}`);

// ============================
//  HOME/
// ============================

export const getHome = () =>
  axiosClient.get("/superadmin/home"); // public route


export const createHome = (data) =>
  axiosClient.post("/superadmin/home", data);


// ============================
//  BANNERS
// ============================

export const addBanner = (data) =>
  axiosClient.post("/superadmin/home/banner", data);

export const updateBanner = (id, data) =>
  axiosClient.put(`/superadmin/home/banner/${id}`, data);

export const deleteBanner = (id) =>
  axiosClient.delete(`/superadmin/home/banner/${id}`);


// ============================
//  CATEGORIES
// ============================

export const addCategory = (data) =>
  axiosClient.post("/superadmin/home/category", data);

export const updateCategory = (id, data) =>
  axiosClient.put(`/superadmin/home/category/${id}`, data);

export const deleteCategory = (id) =>
  axiosClient.delete(`/superadmin/home/category/${id}`);