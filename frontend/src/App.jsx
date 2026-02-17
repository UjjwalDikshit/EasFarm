import Home from "./pages/home";
import About from "./pages/About";
import AllToolsPage from "./components/machines/AllToolsPage";
import AllProductsPage from "./components/fertilisers/AllProductPage";
import WorkInProgress from "./pages/WorkInProgress";
import WeatherButton from "./components/WeatherButton";
import Signup from "./pages/Signup";
import Login from "./components/login";
import Logout from "./components/Logout";
import BlogListPage from "../src/blog/pages/BlogListPage";
import { Routes, Route } from "react-router";
import BlogDetailPage from "./blog/pages/BlogDetailPage";
import UserDashboard from "./pages/UserDashboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path= "/weather" element = {<WeatherButton/>}/>
        <Route path="/products/tools" element={<AllToolsPage />} />
        <Route path="/products/fertilisers" element={<AllProductsPage />} />
        <Route path="/products/husbandry" element={<WorkInProgress />} />
        <Route path="/schemes" element={<WorkInProgress />} />
        <Route path="/signup" element={<Signup />} />
        {/* BLOG ROUTES */}
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/:blogId" element={<BlogDetailPage />} />
        <Route path='/user/dashboard/' element={<UserDashboard/>}/>
      </Routes>
    </>
  );
}

export default App;
