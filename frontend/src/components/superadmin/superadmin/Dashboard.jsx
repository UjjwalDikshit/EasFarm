import { Link } from "react-router-dom";
import { Users, Home } from "lucide-react";

export default function Dashboard() {
    return (
        <div className="p-6 space-y-6">

            <h1 className="text-3xl font-bold">
                Super Admin Dashboard
            </h1>

            <p className="text-gray-500">
                Manage platform users and homepage content
            </p>

            <div className="grid md:grid-cols-2 gap-6">

                {/*  Admin Management */}
                <Link
                    to="/super-admin/admins"
                    className="card bg-base-100 shadow hover:shadow-lg transition p-6 cursor-pointer"
                >
                    <h2 className="text-xl font-semibold mb-2">
                        <Users className="mb-2" />Manage Admins
                    </h2>
                    <p className="text-gray-500">
                       <Home className="mb-2" /> Promote or remove admins
                    </p>
                </Link>

                {/*  Homepage Control */}
                <Link
                    to="/super-admin/home"
                    className="card bg-base-100 shadow hover:shadow-lg transition p-6 cursor-pointer"
                >
                    <h2 className="text-xl font-semibold mb-2">
                        Homepage Control
                    </h2>
                    <p className="text-gray-500">
                        Manage banners and categories
                    </p>
                </Link>

            </div>

        </div>
    );
}