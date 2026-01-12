import axiosClient from "../../utils/axiosClient";

const API_URL = "http://localhost:5000/service/get-all-products";

export const fetchProducts = async ({ page = 1, limit = 10, category, brand, isOrganic, sort, order, search }) => {
  const params = { page, limit, category, brand, isOrganic, sort, order, search };
  const {data} = await axiosClient.get('/service/getAllproduct',{params});
  return data;
};


// /products/fertilisers
