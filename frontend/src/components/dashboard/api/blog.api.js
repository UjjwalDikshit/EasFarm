import axiosClient from "../../../utils/axiosClient";


export const getMyBlogs = ({ page = 1, limit = 10 }) =>
  axiosClient.get(`/blog/me?page=${page}&limit=${limit}`);

export const createBlog = (formData) =>
  axiosClient.post(`/blog`, formData);



export const updateBlog = (id, formData) =>
  axiosClient.put(`/blog/${id}`, formData);


export const deleteBlog = (id) =>
  axiosClient.delete(`/blog/${id}`);



export const changeStatus = (blogId, status) =>
  axiosClient.post(`/blog/${blogId}/status`, {
    status,
  });

export const getSignature = async ({type,fileType}) => {
  const res = await axiosClient.post("/cloudinary/signature",{type,fileType});
  console.log(res);
  return res.data;
};

