import { useState } from "react";
import { Wrench, List } from "lucide-react";
import CreateTool from "./CreateTool";
import ToolListSection from "./ToolListSection";

export default function MainToolsPage() {
  const [openOption, setOpenOption] = useState("create");

  return (
    <div className="min-h-screen bg-base-200 p-6">
      
      <div className="max-w-6xl mx-auto">

        {/* Tabs */}
        <div className="tabs tabs-boxed bg-base-100 shadow-md p-2 rounded-xl w-fit mb-6">
          
          <button
            onClick={() => setOpenOption("create")}
            className={`tab flex gap-2 items-center ${
              openOption === "create" ? "tab-active" : ""
            }`}
          >
            <Wrench size={18} />
            Create Tool
          </button>

          <button
            onClick={() => setOpenOption("myTools")}
            className={`tab flex gap-2 items-center ${
              openOption === "myTools" ? "tab-active" : ""
            }`}
          >
            <List size={18} />
            My Tools
          </button>

        </div>

        {/* Content */}
        <div className="bg-base-100 rounded-2xl shadow-lg p-6 transition-all duration-300">
          {openOption === "create" && <CreateTool />}
          {openOption === "myTools" && (
            <ToolListSection enabled={openOption === "myTools"} />
          )}
        </div>

      </div>
    </div>
  );
}