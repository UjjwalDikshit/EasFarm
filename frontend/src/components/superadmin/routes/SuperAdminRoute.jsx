import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function SuperAdminRoute({ children }) {
    const { user, authLoading } = useSelector((state) => state.auth);

    //  Wait for auth check
    if (authLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    //  Not logged in
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    //  Not super admin
    if (user.role !== "superAdmin") {
        return <Navigate to="/" replace />;
    }

    return children;
}