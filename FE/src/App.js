import './App.css';
import { useState, useEffect } from "react";
import { AppConfig } from "./config/AppConfig";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import loading from "./../src/assets/logo_banner_2.png";
import GuestGuard from './guards/GuestGuard';
import Login from './components/custonmer/login/login';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import NotFound from "./components/notFound/NotFound";
import { GetLoading } from "./app/reducer/LoadingReducer";
import { useAppSelector } from './app/Hook';
import Home from './components/custonmer/home/home';
import DashBoardCustomer from './layout/customer/DashBoardCustomer';
import Signup from "./components/custonmer/signup/Signup"
import Profile from "./components/custonmer/profile/profile";
import LayoutAccount from './layout/customer/account/layoutAccount';


function App() {
  const pathname = window.location.pathname;
  useEffect(() => {
    console.log(pathname);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);
  const [showOnTop, setShowOnTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowOnTop(true);
      } else {
        setShowOnTop(false);
      }
    };

    // Gắn sự kiện cuộn vào cửa sổ
    window.addEventListener("scroll", handleScroll);
    // Gỡ bỏ sự kiện cuộn khi component bị hủy
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const scrollToTop = () => {
    const c = document.documentElement.scrollTop || document.body.scrollTop;
    if (c > 0) {
      window.requestAnimationFrame(scrollToTop);
      window.scrollTo(0, c - c / 20);
    }
  };

  const isLoading = useAppSelector(GetLoading);

  return (
    <div className="App">
      {showOnTop && (
        <div className="button-on-top" onClick={scrollToTop}>
          <FontAwesomeIcon style={{ color: "white", fontSize: 20 }} icon={faArrowUp} />
        </div>
      )}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-logo">
            <img src={loading} alt="Logo" />
          </div>
        </div>
      )}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <BrowserRouter basename={AppConfig.routerBase}>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Navigate replace to="/home" />} />
          <Route path="/login" element={<GuestGuard> <Login /></GuestGuard>} />
          <Route path="/signup" element={<GuestGuard> <Signup /></GuestGuard>} />
          <Route path="/home" element={<DashBoardCustomer><GuestGuard><Home /></GuestGuard></DashBoardCustomer>} />
          <Route path="/profile" element={<DashBoardCustomer><GuestGuard><LayoutAccount><Profile /></LayoutAccount></GuestGuard></DashBoardCustomer>} />
        </Routes>
      </BrowserRouter>
    </div >
  );
}

export default App;
<GuestGuard></GuestGuard>