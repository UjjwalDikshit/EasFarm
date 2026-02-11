import axiosClient from '../../utils/axiosClient';

export const getComments = (blogId, page = 1, limit = 5) =>
  axiosClient.get(`/blogs/${blogId}/comments?page=${page}&limit=${limit}`);

export const addComment = (blogId, content) =>
  axiosClient.post(`/blogs/${blogId}/comments`, { content });

export const replyComment = (commentId, content) =>
  axiosClient.post(`/blogs/comments/${commentId}/reply`, { content });

export const updateComment = (commentId, content) =>
  axiosClient.put(`/blogs/comments/${commentId}`, { content });

export const deleteComment = (commentId) =>
  axiosClient.delete(`/blogs/comments/${commentId}`);
