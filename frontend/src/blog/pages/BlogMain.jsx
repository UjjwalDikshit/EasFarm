import { useSelector } from "react-redux";
import InterestForm from "../components/list/InterestForm"
import BlogListPage from "./BlogListPage";
import { useNavigate } from "react-router-dom";
import { NotPersonalisedFeed } from "./NotPersonalisedListPage";

function BlogMain() {
  const { user, isAuthenticated, authLoading } = useSelector(
    (state) => state.auth,
  );
  const navigate = useNavigate();

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <NotPersonalisedFeed/>
    );
  }

    if (user && !user.hasCompletedOnboarding) {
      return <InterestForm />;
    }

  return <BlogListPage />;
}

export default BlogMain;
