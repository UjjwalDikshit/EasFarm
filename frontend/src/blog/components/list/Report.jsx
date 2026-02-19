import { useState } from "react";
import { Bookmark, BookmarkCheck, ArrowLeft,HandHelping, Flower2 } from "lucide-react";
import toast from "react-hot-toast";



const Report = ({blogId, reportAboutThisBlog }) => {
  const [page, setPage] = useState(1);
  const [complaintType, setComplaintType] = useState("");
  const [description, setDescription] = useState("");

  const complaints = [
    "Sexual content",
    "Violent or repulsive content",
    "Hateful or abusive content",
    "Harassment or bullying",
    "Harmful or dangerous acts",
    "Suicide, self-harm or eating disorders",
    "Misinformation",
    "Child abuse",
    "Promotes terrorism",
    "Spam or misleading",
  ];

  const handleReport = async() => {
    if (!complaintType) {
      toast.error("Please select a reason");
      return;
    }

    // Call parent function
    reportAboutThisBlog({
      targetId:blogId,
      targetType:"blog",
      type: complaintType,
      reason:description,
    });


    // Reset
    setPage(1);
    setComplaintType("");
    setDescription("");
  };

  return (
    <div className="modal-box max-w-md">
      {/* PAGE 1 */}
      {page === 1 && (
        <>
          <h3 className="font-bold text-lg mb-2">Report</h3>
          <p className="text-sm text-gray-500 mb-4">
            We'll check for all Community Guidelines, so don't worry about
            making the perfect choice.
          </p>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {complaints.map((item, i) => (
              <div
                key={i}
                onClick={() => setComplaintType(item)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition 
                  ${
                    complaintType === item
                      ? "bg-primary/10 border-primary"
                      : "hover:bg-base-200"
                  }`}
              >
                {complaintType === item ? (
                  <BookmarkCheck className="text-primary" size={18} />
                ) : (
                  <Bookmark size={18} />
                )}
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>

          <div className="modal-action">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setPage(2)}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* PAGE 2 */}
      {page === 2 && (
        <>
          <div className="flex items-center gap-2 mb-3">
            <ArrowLeft
              size={18}
              className="cursor-pointer"
              onClick={() => setPage(1)}
            />
            <h3 className="font-bold text-lg">Report</h3>
          </div>

          <p className="text-sm text-gray-500 mb-2">
            Want to tell us more? It's optional.
          </p>

          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Share additional details (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="modal-action">
            <button className="btn btn-error btn-sm" onClick={handleReport}>
              Submit Report
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Report;
