import Home from "./pages/home";
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
        <Route path="/products/husbandry" element={<WorkInProgress />} />
        <Route path="/schemes" element={<WorkInProgress />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Detailed Weather" element={<WeatherPage />}/>
        {/* BLOG ROUTES */}
        <Route path="/blog" element={<BlogMain />} />
    
        <Route path="/blog/:blogId" element={<BlogDetailPage />} />
        <Route path="/user/dashboard/" element={<UserDashboard />} />

      </Routes>
    </>
  );
}

export default App;
