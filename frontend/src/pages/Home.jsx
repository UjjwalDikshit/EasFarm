import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Header";
import Main from "../components/Main";
import Banner from "../components/Banner";
import CardGrid from "../components/CardGrid";
import Footer from "../components/Footer";
import { fetchHomeBannerAndCards } from "../asyncThunk";
import Loading from "../components/Loading";

function Home() {
  const theme = useSelector((state) => state.theme.mode);
  const { fetched, loading, error } = useSelector((state) => state.home);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!fetched) {
      dispatch(fetchHomeBannerAndCards());
    }
  }, [dispatch]);

  if (loading) {
    return <Loading/>
  }
  if (error) return <p> Error : {error} </p>;

  return (
    <div
      data-theme={theme}
      className="flex flex-col min-h-screen bg-base-100 transition-colors duration-300"
    >
      {/* <Header /> */}
      <Main />
      <Footer />
    </div>
  );
}

export default Home;
