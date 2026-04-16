import { useState } from "react";
import { PackagePlus, List } from "lucide-react";
import CreateSF from "./CreateSF";
import SFListSection from "./SFListSection";

export default function MainSeedFertiliserPage() {
  const [tab, setTab] = useState("create");

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Tabs */}
        <div className="tabs tabs-boxed bg-base-100 shadow-md p-2 rounded-xl w-fit mb-6">
          
          <button
            onClick={() => setTab("create")}
            className={`tab flex gap-2 items-center ${
              tab === "create" ? "tab-active" : ""
            }`}
          >
            <PackagePlus size={18} />
            Sell Product
          </button>

          <button
            onClick={() => setTab("my")}
            className={`tab flex gap-2 items-center ${
              tab === "my" ? "tab-active" : ""
            }`}
          >
            <List size={18} />
            My Products
          </button>

        </div>

        {/* Content */}
        <div className="bg-base-100 rounded-2xl shadow-lg p-6">
          {tab === "create" && <CreateSF onSuccess={() => setTab("my")} />}
          {tab === "my" && <SFListSection enabled={tab === "my"} />}
        </div>

      </div>
    </div>
  );
}