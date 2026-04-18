import axiosClient from "../../../utils/axiosClient";


// ============================
// REPORTS
// ============================

// get reports (filter: pending / reviewed / resolved)
export const getReports = (status = "pending") =>
  axiosClient.get(`/admin/reports?status=${status}`);


// MARK AS REVIEWED
export const markReportReviewed = (id) =>
  axiosClient.put(`/admin/reports/${id}/review`);


// RESOLVE REPORT
export const resolveReport = (id) =>
  axiosClient.put(`/admin/reports/${id}/resolve`);


// delete reported content (blog/comment)
export const deleteReportedTarget = (type, targetId) =>
  axiosClient.delete(`/admin/reports/delete-target/${type}/${targetId}`);


// ============================
// SCHEMES
// ============================

// get all schemes
export const getSchemes = () =>
  axiosClient.get("/admin/schemes");

// create scheme
export const createScheme = (data) =>
  axiosClient.post("/admin/schemes", data);

// update scheme
export const updateScheme = (id, data) =>
  axiosClient.put(`/admin/schemes/${id}`, data);

// delete scheme
export const deleteScheme = (id) =>
  axiosClient.delete(`/admin/schemes/${id}`);