import axiosClient from "../../utils/axiosClient";

// services/reaction.api.js
export const reactOnBlog = ({ blogId, type }) => {
  return axiosClient.post(`/blog/${blogId}/reactions`, { type });
};

export const toggleLike = async (blogId,type="like") => {
  const { data } = await axios.post(`/blog/${blogId}/reactions`, { type });
  return data;
};
// blog/:id/reactions, blog/698dbf7ea9521cfaf9266450/reactions