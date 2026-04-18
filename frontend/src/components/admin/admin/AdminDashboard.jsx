import { Link } from "react-router-dom";
import { Users, Home, Flag, Landmark } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">

      <h1 className="text-3xl font-bold">
        Admin Dashboard
      </h1>

      <p className="text-gray-500">
        Manage platform moderation and government schemes
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Reports Moderation */}
        <Link
          to="/admin/reports"
          className="card bg-base-100 shadow hover:shadow-lg transition p-6"
        >
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Flag /> Review Reports
          </h2>
          <p className="text-gray-500 mt-2">
            Handle blog/comment reports
          </p>
        </Link>

        {/* Government Schemes */}
        <Link
          to="/admin/schemes"
          className="card bg-base-100 shadow hover:shadow-lg transition p-6"
        >
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Landmark /> Government Schemes
          </h2>
          <p className="text-gray-500 mt-2">
            Add / remove schemes for farmers
          </p>
        </Link>

      </div>

    </div>
  );
}