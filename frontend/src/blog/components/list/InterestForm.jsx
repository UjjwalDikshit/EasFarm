import { useEffect, useState } from "react";
import axiosClient from "../../../utils/axiosClient";
import { CheckCircle, Tag, Layers, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { fetchUser } from "../../../features/authSlice";

export default function InterestForm() {
  const [categories, setCategories] = useState([]);
  const [tagsList, setTagsList] = useState([]);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, tagRes] = await Promise.all([
          axiosClient.get("/blog/categories"),
          axiosClient.get("/blog/tags"),
        ]);

        setCategories(catRes.data.categories);
        setTagsList(tagRes.data.tags);
      } catch (err) {
        console.error("Failed to load interest data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat]
    );
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      await axiosClient.post("/blog/user/interests", {
        categories: selectedCategories,
        tags: selectedTags,
      });

      setSuccess(true);
      dispatch(fetchUser());
    } catch (err) {
      console.error("Onboarding failed",err.response.data.error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-blue-600">
        <Loader2 className="animate-spin mr-2" />
        Loading Interests...
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-blue-600">
        <CheckCircle size={48} className="mb-4" />
        <h2 className="text-2xl font-semibold">
          You have completely selected your Interest of Field
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 flex justify-center items-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Select Your Interests
        </h2>

        {/* Categories */}
        <div className="mb-6">
          <div className="flex items-center mb-3 text-blue-600">
            <Layers className="mr-2" />
            <h3 className="font-semibold text-lg">Categories</h3>
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-4 py-2 rounded-full border transition ${
                  selectedCategories.includes(cat)
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <div className="flex items-center mb-3 text-blue-600">
            <Tag className="mr-2" />
            <h3 className="font-semibold text-lg">Tags</h3>
          </div>

          <div className="flex flex-wrap gap-3">
            {tagsList.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-full border transition ${
                  selectedTags.includes(tag)
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition flex items-center justify-center mx-auto"
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              "Complete Onboarding"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
