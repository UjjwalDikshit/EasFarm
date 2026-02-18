// import { useEffect, useState } from "react";
// import { changeStatus } from "../api/blog.api";

// export default function MyBlogCard(
//   blog,
//   changeStatusOfBlog,
//   deleteBlog,
//   updateBlog,
// ) {
//   const {
//     title,
//     isdeleted,
//     status,
//     tags,
//     category,
//     isFeatured,
//     isDeleted,
//     viewsCount,
//     likesCount,
//     commentsCount,
//     createdAt,
//     publishedAt,
//     updatedAt,
//     __v
//   } = blog;

//   const chhoseDelete = () => {
//     const [yes, setYes] = useState("false");
//     setYes("aleart Do You reely ewna to delte");
//     // popUpThatDo you really want to delete yes not
//     if (yes) deleteBlog();
//   };
//   const chooseStatus = () => {
//     let status = ["draft", "archieved", "publish"];
//     let finalstatus = status.filter((s) => {
//       s != status;
//     });

//     let [choosenStatus, setchoosenStatus] = useState(finalstatus[0]);

//     useEffect(()=>{
//       return (
//         <div>
//             {/* <button disable = status == 'published'>Published</button>
//             <button disable = status == 'archieved'>Archieved</button>
//             <button disable = status == 'draft'>Draft</button> */}
//             {/* // pop to choose one among archieved or pulished or archieved, if already not in status */}
//         </div>
//         );
//     });

//     changeStatus(id,status)

//   };
//   const EditCard = () => {
//     // show popup that work is yet to complete.
//   };
//   return (
//     <div>
//       <div >
//         <button>chooseStatus</button>{" "}
//         {/* status -> if want to publis then call one api */}
//         <button>Edit</button>
//         <button>Status</button>
//         <button onClick={deleteBlog()}>Delete</button>
//         <button></button>
//       </div>
//       <div>
//         title
//       </div>
//       <div>
//         // print here info like: likesCount,viewCount, createdAt, publishedAt|arched|draftAt,lastUpdate,No.oftimeChanged
//       </div>
//     </div>

//   );
// }
import { Edit, Trash2, Upload, FileText } from "lucide-react";

export default function MyBlogCard({
  blog,
  updateBlog,
  deleteBlog,
  changeStatus,
}) {
  const {
    _id,
    title,
    status,
    viewsCount,
    likesCount,
    commentsCount,
    createdAt,
    publishedAt,
  } = blog;

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete?")) {
      deleteBlog(_id);
    }
  };

  const handleStatusChange = (newStatus) => {
    if (newStatus === status) return; // no change

    changeStatus({ id: _id, status: newStatus });
  };

  return (
    <div className="card bg-base-100 shadow-md border border-base-300">
      <div className="card-body">
        {/* Top Controls */}
        <div className="flex justify-between items-center">
          <h2 className="card-title">{title}</h2>

          <div className="flex gap-2">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-sm btn-outline">
                {status}
              </label>

              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40"
              >
                {["draft", "published", "archived"].map((s) => (
                  <li key={s}>
                    <button
                      disabled={s === status}
                      onClick={() => handleStatusChange(s)}
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() =>
                updateBlog({
                  blogId: _id,
                  formData: { title: title + " (Edited)" },
                })
              }
              className="btn btn-sm btn-info"
            >
              <Edit size={16} />
            </button>

            <button onClick={handleDelete} className="btn btn-sm btn-error">
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Status Badge */}
        <div className="badge badge-primary w-fit">{status}</div>

        {/* Stats */}
        <div className="flex gap-6 text-sm text-gray-500 mt-2">
          <span>👁 {viewsCount}</span>
          <span>❤️ {likesCount}</span>
          <span>💬 {commentsCount}</span>
        </div>

        {/* Dates */}
        <div className="text-xs text-gray-400 mt-2">
          Created: {new Date(createdAt).toLocaleDateString()}
          {publishedAt && (
            <>
              {" | "}
              Published: {new Date(publishedAt).toLocaleDateString()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
