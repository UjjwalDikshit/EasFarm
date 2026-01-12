import axiosClient from "../../utils/axiosClient";

export const fetchTools = async ({ page = 1, limit = 10, category, sort, order, search }) => {
  const params = { page, limit, category, sort, order, search };
  const { data } = await axiosClient.get('/service/get-all-tools', { params });
  return data;
};


