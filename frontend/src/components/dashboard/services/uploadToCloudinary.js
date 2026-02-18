import axios from "axios";
import { getSignature } from "../api/blog.api";

export const uploadToCloudinary = async ({ type, fileType, file }) => {
  //  Get signature from backend
  const {
    timestamp,
    signature,
    folder,
    resource_type,
    eager,
    eager_async,
    cloudName,
    apiKey,
  } = await getSignature({ type, fileType });

  //  Prepare form data
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("folder", folder);
  formData.append("resource_type",resource_type);
  
  if (eager) formData.append("eager", eager);
  if (typeof eager_async !== "undefined")
    formData.append("eager_async", eager_async);

  //  Upload to correct endpoint
  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resource_type}/upload`,
    formData
  );

  return res.data;
};
