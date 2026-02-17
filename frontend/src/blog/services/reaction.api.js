import axiosClient from "../../utils/axiosClient";

// services/reaction.api.js
export const reactOnBlog = ({ blogId, type }) => {
  return axiosClient.post(`/blog/${blogId}/reactions`, { type });
};

export const toggleLike = async (blogId,type="like") => {
  const { data } = await axiosClient.post(`/blog/${blogId}/reactions`, { type });
  console.log("Indie reaction inside services inside blog",data);
  return data;
};
// blog/:id/reactions, blog/698dbf7ea9521cfaf9266450/reactions