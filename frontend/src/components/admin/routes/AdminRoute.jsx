import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
    const { user, authLoading } = useSelector((state) => state.auth);

    if (authLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const allowed = ["admin"];

    if (!allowed.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
}