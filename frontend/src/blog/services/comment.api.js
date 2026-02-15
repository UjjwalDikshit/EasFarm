import axiosClient from "../../utils/axiosClient";

export const getComments = (blogId, page = 1, limit = 5) =>
  axiosClient.get(`/blog/${blogId}/comments?page=${page}&limit=${limit}`); // /:id/comments

export const addComment = (blogId, content) =>
  axiosClient.post(`/blog/${blogId}/comments`, { content });

export const replyComment = (commentId, content) =>
  axiosClient.post(`/blog/comments/${commentId}/reply`, { content });

export const updateComment = (commentId, content) =>
  axiosClient.put(`/blog/comments/${commentId}`, { content });

export const deleteComment = (commentId) =>
  axiosClient.delete(`/blog/comments/${commentId}`);

// blogdetail page ke liye

export const AddComment = async ({ blogId, text }) => {
  const { data } = await axios.post(`/blog/${blogId}/comments`, {
    text,
  });
  return data;
};
