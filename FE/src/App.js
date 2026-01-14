import './App.css';
import { useState, useEffect } from "react";
import { AppConfig } from "./config/AppConfig";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import loading from "./../src/image/logo_banner_2.png";
import GuestGuard from './guards/GuestGuard';
import AuthGuard from './guards/AuthGuard';
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
import DashBoardAdmin from './layout/admin/DashBoardAdmin';
import LoginAdmin from './components/admin/login-Admin/login-Admin';
import CategoryAdmin from './components/admin/category/Category-Management';
import BrandAdmin from './components/admin/brand/Brand-Management';
import MaterialAdmin from './components/admin/material/Material-Management';
import SoleAdmin from './components/admin/sole/Sole-Management';
import ProductAdmin from './components/admin/product/Product-Management';
import BillAdmin from './components/admin/bill/Bill-Management';
import StaffAdmin from './components/admin/staff/Staff-Management';
import CustomerAdmin from './components/admin/customer/Customer-Management';
import CreateProductAdmin from './components/admin/product/CreateProductManagment';
import UpdateProductDetailAdmin from './components/admin/product/UpdateProductDetailManagment';
import CreateCustomer from "./components/admin/customer/modal/ModalCreateCustomer";
import UpdateCustomer from "./components/admin/customer/modal/ModalUpdateCustomer";
import DetailCustomer from "./components/admin/customer/modal/ModalDetailCustomer";
import FormCreateStaff from "./components/admin/staff/modal/CreateStaff";
import FormUpdateStaff from "./components/admin/staff/modal/UpdateStaff";
import FormDetailStaff from "./components/admin/staff/modal/DetailStaff";
import FormDetailBill from "./components/admin/bill/DetailBill";
import FormDetailProductCustomer from "./components/custonmer/productDetail/productDetail";
import { CartService } from './components/custonmer/cart/CartService';
import Cart from "./components/custonmer/cart/Card";
import Payment from "./components/custonmer/payment/Payment";
import PaymentAccount from "./components/custonmer/payment/PaymentAccount";
import PayMentSuccess from "./components/custonmer/payment/PaymentSuccess";

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
          <Route path="/" element={<GuestGuard><CartService><DashBoardCustomer><Home /></DashBoardCustomer></CartService></GuestGuard>} />
          <Route path="/login" element={<GuestGuard> <Login /></GuestGuard>} />
          <Route path="/signup" element={<GuestGuard> <Signup /></GuestGuard>} />
          <Route path="/home" element={<AuthGuard><CartService><DashBoardCustomer><Home /></DashBoardCustomer></CartService></AuthGuard>} />
          <Route path="/payment" element={<AuthGuard><CartService><DashBoardCustomer><Payment /></DashBoardCustomer></CartService></AuthGuard>} />
          <Route path="/payment-acc" element={<AuthGuard><CartService><DashBoardCustomer><PaymentAccount /></DashBoardCustomer></CartService></AuthGuard>} />
          <Route path="/payment/payment-success" element={<AuthGuard><CartService><DashBoardCustomer><PayMentSuccess /></DashBoardCustomer></CartService></AuthGuard>} />
          <Route path="/cart" element={<AuthGuard><CartService><DashBoardCustomer><Cart /></DashBoardCustomer></CartService></AuthGuard>} />
          <Route path="/detail-product/:id" element={<AuthGuard><CartService><DashBoardCustomer><FormDetailProductCustomer /></DashBoardCustomer></CartService></AuthGuard>} />
          <Route path="/profile" element={<AuthGuard><CartService><DashBoardCustomer><Profile /></DashBoardCustomer></CartService></AuthGuard>} />
          <Route path="/admin" element={<AuthGuard requiredRole="ROLE_ADMIN"><DashBoardAdmin /></AuthGuard>} />
          <Route path="/login-management" element={<GuestGuard><LoginAdmin /></GuestGuard>} />
          <Route path="/category-management" element={<AuthGuard requiredRole="ROLE_ADMIN"><DashBoardAdmin><CategoryAdmin /></DashBoardAdmin></AuthGuard>} />
          <Route path="/brand-management" element={<AuthGuard requiredRole="ROLE_ADMIN"><DashBoardAdmin><BrandAdmin /></DashBoardAdmin></AuthGuard>} />
          <Route path="/material-management" element={<AuthGuard requiredRole="ROLE_ADMIN"><DashBoardAdmin><MaterialAdmin /></DashBoardAdmin></AuthGuard>} />
          <Route path="/sole-management" element={<AuthGuard requiredRole="ROLE_ADMIN"><DashBoardAdmin><SoleAdmin /></DashBoardAdmin></AuthGuard>} />
          <Route path="/product-management" element={<AuthGuard requiredRole="ROLE_ADMIN"><DashBoardAdmin><ProductAdmin /></DashBoardAdmin></AuthGuard>} />
          <Route path="/bill-management" element={<AuthGuard requiredRole="ROLE_ADMIN"><DashBoardAdmin><BillAdmin /></DashBoardAdmin></AuthGuard>} />
          <Route path="/bill-management/detail-bill/:id" element={<AuthGuard requiredRole="ROLE_ADMIN"><DashBoardAdmin><FormDetailBill /></DashBoardAdmin></AuthGuard>} />
          <Route path="/staff-management" element={<AuthGuard requiredRole="ROLE_ADMIN"><DashBoardAdmin><StaffAdmin /></DashBoardAdmin></AuthGuard>} />
          <Route path="/customer-management" element={<AuthGuard requiredRole="ROLE_ADMIN"><DashBoardAdmin><CustomerAdmin /></DashBoardAdmin></AuthGuard>} />
          <Route path="/create-product-management" element={<AuthGuard requiredRole="ROLE_ADMIN"><DashBoardAdmin><CreateProductAdmin /></DashBoardAdmin></AuthGuard>} />
          <Route path="/product-detail-management/:id" element={<AuthGuard requiredRole="ROLE_ADMIN"><DashBoardAdmin><UpdateProductDetailAdmin /></DashBoardAdmin></AuthGuard>} />
          <Route path="/create-customer-management" element={<AuthGuard requiredRole="ROLE_ADMIN"><DashBoardAdmin><CreateCustomer /></DashBoardAdmin></AuthGuard>} />
          <Route path="/update-customer-management/:id" element={<AuthGuard requiredRole="ROLE_ADMIN"><DashBoardAdmin><UpdateCustomer /></DashBoardAdmin></AuthGuard>} />
          <Route path="/detail-customer-management/:id" element={<AuthGuard requiredRole="ROLE_ADMIN"><DashBoardAdmin><DetailCustomer /></DashBoardAdmin></AuthGuard>} />
          <Route path="/create-staff-management" element={<AuthGuard requiredRole="ROLE_ADMIN"><DashBoardAdmin><FormCreateStaff /></DashBoardAdmin></AuthGuard>} />
          <Route path="/update-staff-management/:id" element={<AuthGuard requiredRole="ROLE_ADMIN"><DashBoardAdmin><FormUpdateStaff /></DashBoardAdmin></AuthGuard>} />
          <Route path="/detail-staff-management/:id" element={<AuthGuard requiredRole="ROLE_ADMIN"><DashBoardAdmin><FormDetailStaff /></DashBoardAdmin></AuthGuard>} />

        </Routes>
      </BrowserRouter>
    </div >
  );
}

export default App;