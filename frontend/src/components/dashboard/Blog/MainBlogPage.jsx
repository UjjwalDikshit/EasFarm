import { useState } from "react";
import { FilePlus2, BookOpen } from "lucide-react";
import BlogCreateForm from "./BlogCreateForm";
import BlogPrintSection from "./BlogPrintSection";

export default function MainBlogPage() {
  const [openBlogOption, setOpenBlogOption] = useState("create");

  return (
    <div className="min-h-screen bg-base-200 p-6">
      
      {/* HEADER */}
      <div className="max-w-6xl mx-auto">

        {/* Horizontal Tabs */}
        <div className="tabs tabs-boxed bg-base-100 shadow-md p-2 rounded-xl w-fit mb-6">
          
          <button
            onClick={() => setOpenBlogOption("create")}
            className={`tab flex gap-2 items-center ${
              openBlogOption === "create" ? "tab-active" : ""
            }`}
          >
            <FilePlus2 size={18} />
            Create Blog
          </button>

          <button
            onClick={() => setOpenBlogOption("myBlogs")}
            className={`tab flex gap-2 items-center ${
              openBlogOption === "myBlogs" ? "tab-active" : ""
            }`}
          >
            <BookOpen size={18} />
            My Blogs
          </button>

        </div>

        {/* CONTENT SECTION */}
        <div className="bg-base-100 rounded-2xl shadow-lg p-6 transition-all duration-300">
          {openBlogOption === "create" && <BlogCreateForm />}
          {openBlogOption === "myBlogs" && <BlogPrintSection enabled={openBlogOption==='myBlogs'}/>}
        </div>

      </div>
    </div>
  );
}
