import { useState } from "react";
import { useForm } from "react-hook-form";
import { useCreateBlog } from "../hooks/blog.mutations";
import { uploadToCloudinary } from "../services/uploadToCloudinary";
import toast from "react-hot-toast";

export default function BlogCreateForm() {
  const [mediaType, setMediaType] = useState("image");
  const [isUploading, setIsUploading] = useState(false);
  const { mutateAsync: createBlog } = useCreateBlog();
  const [tags, setTags] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const fileAcceptTypes = {
    image: "image/*",
    video: "video/*",
    pdf: "application/pdf",
  };

  const addTag = () => {
    const value = getValues("currentTag");

    if (!value?.trim()) return;
    if (tags.includes(value.trim())) return;
    if (tags.length >= 10) return;

    setTags([...tags, value.trim()]);
    setValue("currentTag", "");
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const onSubmit = async (formData) => {

    try {
      setIsUploading(true); // spinner start

      let uploadedMedia = null;

      if (["image", "video", "pdf"].includes(mediaType)) {
        console.log(mediaType);
        
        const uploadDetails = await uploadToCloudinary({
          type: "blog",
          fileType: mediaType,
          file: formData.file,
        });

        uploadedMedia = {
          secureUrl: uploadDetails.secure_url,
          publicId: uploadDetails.public_id,
          resourceType: uploadDetails.resource_type,
          format: uploadDetails.format,
          bytes: uploadDetails.bytes,
        };
      }

      const finalData = {
        title: formData.title,
        content: formData.content,
        tags,
        category: formData.category,
        mediaType,
        media: uploadedMedia,
        thumbnail:
          mediaType === "video"
            ? {
                secureUrl: uploadDetails.eager?.[0]?.secure_url,
                publicId: uploadDetails.eager?.[0]?.public_id,
              }
            : null,
      };

      await createBlog(finalData);

      toast.success("Blog created successfully");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsUploading(false); // spinner stop
    }
  };

  if (isUploading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Uploading... Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className=" mx-auto p-6 bg-grey shadow-xl rounded-2xl space-y-5"
    >
      <h2 className="text-2xl font-bold text-green-900">Create Blog</h2>

      {/* Title */}
      <div>
        <input
          {...register("title", {
            required: "Title is Mandatory for Blog Creation",
          })}
          placeholder="Enter Your Blog Title"
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Slug */}
      <div>
        <input
          {...register("slug")}
          placeholder="Enter slug for Your Blog"
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
        />
      </div>

      {/* Content */}
      <div>
        <textarea
          {...register("content", {
            required: "Content is Mandatory for Blog Creation",
          })}
          placeholder="Enter Content (HTML or Text)"
          rows={5}
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
        />
        {errors.content && (
          <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
        )}
      </div>

      {/* Media Type */}
      <div>
        <select
          value={mediaType}
          onChange={(e) => setMediaType(e.target.value)}
          className="bg-green-100 text-black w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
        >
          <option value="image" className="bg-grey">
            Image
          </option>
          <option value="video" className="bg-grey">
            Video
          </option>
          <option value="pdf" className="bg-grey">
            Document
          </option>
        </select>
      </div>

      {/* File Upload */}
      <div>
        <input
          {...register("file", { required: "File is required" })}
          type="file"
          accept={fileAcceptTypes[mediaType]}
          className="text-white w-full border rounded-lg p-3 "
        />
        {errors.file && (
          <p className="text-red-500 text-sm mt-1">{errors.file.message}</p>
        )}
      </div>

      {/* Status */}
      <div>
        <select
          {...register("status")}
          className="bg-green-100 text-black w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archieved">Archived</option>
        </select>
      </div>

      {/* Tags Section */}
      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Tags (Max 10)
        </label>

        <div className="flex gap-2">
          <input
            {...register("currentTag", {
              validate: () => tags.length > 0 || "At least one tag is required",
            })}
            placeholder="Enter tag"
            className="flex-1 border rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
          />

          <button
            type="button"
            onClick={addTag}
            className="bg-green-600 text-white px-4 rounded-lg hover:bg-green-700 transition"
          >
            Add
          </button>
        </div>

        {errors.currentTag && (
          <p className="text-red-500 text-sm mt-1">
            {errors.currentTag.message}
          </p>
        )}

        {/* Tag List */}
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-red-500 font-bold"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition"
      >
        Create Blog
      </button>
    </form>
  );
}
