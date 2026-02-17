const getSignature = async (type) => {
  const res = await fetch("/upload/signature", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type }),
  });

  return await res.json();
};


const uploadFile = async (file, type) => {
  const signData = await getSignature(type);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signData.apiKey);
  formData.append("timestamp", signData.timestamp);
  formData.append("signature", signData.signature);
  formData.append("folder", signData.folder);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${signData.cloudName}/auto/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  return await uploadRes.json();
};

/*
{
  "secure_url": "...",
  "public_id": "production/courses/videos/abc123",
  "resource_type": "video",
  "duration": 48.3,
  "bytes": 987654321
}
*/

const uploadResponse = await uploadFile(file, "blog");

const blogData = {
  title,
  content,
  coverImage: {
    url: uploadResponse.secure_url,
    public_id: uploadResponse.public_id,
  },
};

await fetch("/blog/create", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(blogData),
});


export const createBlog = async (req, res) => {
  try {
    const blog = await Blog.create({
      title: req.body.title,
      content: req.body.content,
      coverImage: req.body.coverImage,
      video: req.body.video,
      author: req.user._id,
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Blog creation failed" });
  }
};
