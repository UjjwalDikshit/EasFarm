import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  FileText,
  Tractor,
  Leaf,
  Wallet,
  Landmark,
} from "lucide-react";

import MainBlogPage from "../components/dashboard/Blog/MainBlogPage";
import TransactionList from "../components/dashboard/trasactions/TransactionList";
import WorkInProgress from "./WorkInProgress";
import MainToolsPage from "../components/dashboard/serviceProvider/machinery/MainToolsPage";
import MainSeedFertiliserPage from "../components/dashboard/serviceProvider/seed/MainSeedFertiliserPage";

const UserDashboard = () => {
  const [whichTab, setTab] = useState("blog");

  // =========================
  // GET USER FROM REDUX
  // =========================
  const auth = useSelector((state) => state.auth);
  const user = auth?.user;

  // =========================
  // SAFE FALLBACKS
  // =========================
  const fullName = user?.fullName || "User";
  const joinedAt = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : "N/A";

  const image = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    fullName
  )}&background=658f12&color=fff`;

  const tags = user?.interests?.tags || [];

  // =========================
  // TABS
  // =========================
  const tabs = [
    { key: "blog", label: "Create Blog", icon: FileText },
    { key: "machinery", label: "Rent Machinery", icon: Tractor },
    { key: "fertiliser", label: "Sell Fertiliser", icon: Leaf },
    { key: "transaction", label: "Transaction History", icon: Wallet },
    { key: "schemes", label: "Govt. Schemes Applied", icon: Landmark },
  ];

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ========== USER CARD ========== */}
        <div className="card bg-base-100 shadow-xl rounded-2xl">
          <div className="card-body flex flex-col md:flex-row items-center gap-6">

            <div className="avatar">
              <div className="w-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={image} alt={fullName} />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold">{fullName}</h2>

              <p className="text-sm text-gray-500">
                Joined on {joinedAt}
              </p>

              <span className="badge badge-primary mt-2">
                {user?.role || "farmer"}
              </span>

              <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                {tags.length > 0 ? (
                  tags.map((tag, i) => (
                    <span key={i} className="badge badge-outline">
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-400">
                    No interests added
                  </span>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* ========== TABS ========== */}
        <div className="overflow-x-auto bg-base-100 rounded-2xl shadow-md p-2">
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = whichTab === tab.key;

              return (
                <button
                  key={tab.key}
                  onClick={() => setTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all
                  ${
                    active
                      ? "bg-primary text-primary-content shadow-md"
                      : "hover:bg-base-200"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ========== CONTENT ========== */}
        <div className="bg-base-100 rounded-2xl shadow-xl p-6 min-h-[400px]">
          {whichTab === "blog" && <MainBlogPage />}
          {whichTab === "machinery" && <MainToolsPage />}
          {whichTab === "fertiliser" && <MainSeedFertiliserPage />}
          {whichTab === "transaction" && <TransactionList />}
          {whichTab === "schemes" && <WorkInProgress />}
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;

// able to create blog, able to create Machinery service, able to create fertiliser post, husbandry
// can be able to see thier transaction, governmentSchemes applied,

//----------------------------------------------------------------------------------------------------------------------------------------------------
//|  Create Blog     |   Machinery Post Create | fertiliser post Create | husbandry service create | transaction history |my Orders | govt schemes applied    |
//---------------------------------------------------------------------------------------------------------------------------------------------------
// after clicking on create blog ,show a create form for blog creation, and list down user created blog in newly created blog  first order.
// when blog list down, that card should have icon at top like publish <-> unpublish,delete,update
// after create of blog, update it optimisacally and  show at top
// on clicking other button like Machinery post create : "show yet to complete"
