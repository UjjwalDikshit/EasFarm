import Home from "./pages/Home";
import About from "./pages/About";
import AllToolsPage from "./components/machines/AllToolsPage";
import AllProductsPage from "./components/fertilisers/AllProductPage";
import WorkInProgress from "./pages/WorkInProgress";
import WeatherButton from "./components/WeatherButton";
import Signup from "./pages/Signup";
import Login from "./components/login";
import Logout from "./components/Logout";
import BlogMain from "../src/blog/pages/BlogMain";
import { Routes, Route } from "react-router";
import BlogDetailPage from "./blog/pages/BlogDetailPage";
import UserDashboard from "./pages/UserDashboard";
import WeatherPage from "./pages/WeatherPage";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { fetchUser } from "./features/authSlice";
import { useEffect } from "react";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import EditProfilePage from "./pages/EditProfilePage";

import SuperAdminRoute from "../src/components/superadmin/routes/SuperAdminRoute";
import Dashboard from "../src/components/superadmin/superadmin/Dashboard";
import ManageAdmins from "./components/superadmin/superadmin/ManageAdmins";
import HomeControl from "../src/components/superadmin/components/HomeControl";
import ManageReports from "./components/admin/admin/ManageReports";
import SchemeControl from "./components/admin/components/SchemaControl";
import AdminRoute from "./components/admin/routes/AdminRoute";
import AdminDashboard from "./components/admin/admin/AdminDashboard";
import GovernmentSchemes from "./pages/GovernmentSchemes";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, []);

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/weather" element={<WeatherButton />} />
        <Route path="/products/tools" element={<AllToolsPage />} />
        <Route path="/products/fertilisers" element={<AllProductsPage />} />
        <Route path="/husbandry" element={<WorkInProgress />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route path="/Detailed Weather" element={<WeatherPage />} />
        <Route path="/schemes" element={<GovernmentSchemes/>}/>
        {/* BLOG ROUTES */}
        <Route path="/blog" element={<BlogMain />} />

        <Route path="/blog/:blogId" element={<BlogDetailPage />} />
        <Route path="/user/dashboard/" element={<UserDashboard />} />
        <Route
          path="/super-admin"
          element={
            <SuperAdminRoute>
              <Dashboard />
            </SuperAdminRoute>
          }
        />

        <Route
          path="/super-admin/admins"
          element={
            <SuperAdminRoute>
              <ManageAdmins />
            </SuperAdminRoute>
          }
        />

        <Route
          path="/super-admin/home"
          element={
            <SuperAdminRoute>
              <HomeControl />
            </SuperAdminRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <AdminRoute>
              <ManageReports />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/schemes"
          element={
            <AdminRoute>
              < SchemeControl/>
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
