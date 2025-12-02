import { useState, useEffect } from "react";
import {
    FacebookOutlined, InstagramOutlined, TwitterOutlined, YoutubeOutlined, EnvironmentOutlined,
    FileSearchOutlined, ShoppingCartOutlined, UserOutlined,
} from "@ant-design/icons";
import { Col, Row, Badge, Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "./dash-Board-Customer.css";
import logo from "./../../assets/logo_banner_2.png";
import { deleteToken } from "../../config/Cookies";

const DashBoardCustomer = ({ children }) => {
    const [showHeaderMenu, setShowHeaderMenu] = useState(false);
    const idUser = sessionStorage.getItem("idAccount");
    const [openInfor, setOpenInfo] = useState(false);
    const [isOptionVisible, setOptionVisible] = useState(false);
    const [activeField, setActiveField] = useState("");

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 110) {
                setShowHeaderMenu(true);
            } else {
                setShowHeaderMenu(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const fields = [
        {
            className: "title-menu",
            title: "TRANG CHỦ",
            href: "/home",
        },
        {
            className: "title-menu",
            title: "SẢN PHẨM",
            href: "/#",
        },

    ];

    const nav = useNavigate();

    const handleMenuHover = () => {
        setOpenInfo(true);
    };

    const handleMenuLeave = () => {
        setOpenInfo(false);
    };

    const logout = () => {
        deleteToken();
        sessionStorage.removeItem("idAccount");
        window.location.href = "/home";
    };

    const handleLeave = () => {
        setOptionVisible(false);
        setActiveField("");
    };

    const handleHover = (title) => {
        setOptionVisible(true);
        setActiveField(title);
    };

    return (
        <div className="dashboard-customer">
            <div>
                <div className="header">
                    <div className="logo-header">
                        <Link to="/home">
                            {" "}
                            <img className="logo-img" src={logo} alt="..." />
                        </Link>
                    </div>
                    <div className="space-header">
                        {fields.map((field, index) => {
                            return (
                                <div
                                    className={field.className}
                                    key={index}
                                    onMouseEnter={() => handleHover(field.title)}
                                    onMouseLeave={handleLeave}
                                >
                                    <Link to={field.href} className="link-header">
                                        {field.title}
                                    </Link>
                                    {field.option &&
                                        isOptionVisible &&
                                        activeField === field.title && (
                                            <Menu className="option-container">
                                                {field.option.map((option, optionIndex) => (
                                                    <Link to="#">
                                                        <div key={optionIndex} className={option.className}>
                                                            {option.title}
                                                        </div>
                                                    </Link>
                                                ))}
                                            </Menu>
                                        )}
                                </div>
                            );
                        })}
                    </div>
                    <div className="content-header-home">
                        <Link to="/#" className="title-header">
                            <span className="header-icon">
                                <FileSearchOutlined /> Tra cứu
                            </span>

                        </Link>
                    </div>
                    <div className="content-header-home">
                        <Link to="#" className="title-header">
                            <span className="header-icon"><EnvironmentOutlined /> Tìm kiếm cửa hàng</span>
                        </Link>
                    </div>
                    <div className="content-header-home">
                        <Link to="/#" className="title-header">
                            <Badge>
                                <span className="header-icon"><ShoppingCartOutlined />  Giỏ hàng</span>
                            </Badge>
                        </Link>
                    </div>
                    <div
                        className="content-header-account"
                        onMouseEnter={handleMenuHover}
                        onMouseLeave={handleMenuLeave}
                    >
                        <Link
                            to={idUser === null ? "/login" : "#"}
                            className="title-header-account"
                        >
                            <span className="header-icon">
                                <UserOutlined />
                            </span>{" "}
                            {idUser === null ? "Đăng nhập" : "Thông tin"}
                        </Link>
                        {openInfor && idUser !== null ? (
                            <ul className="dropdown-list">
                                <li className="dropdown-item" onClick={() => nav("/profile")}>
                                    Tài khoản của tôi
                                </li>
                                <li className="dropdown-item" onClick={() => nav("/#")}>
                                    Đơn mua
                                </li>
                                <li className="dropdown-item" onClick={logout}>
                                    Đăng xuất
                                </li>
                            </ul>
                        ) : (
                            ""
                        )}
                    </div>
                </div>
                {/* <SalesHeader /> */}
            </div>
            <div>{children}</div>
            <div>
                {" "}
                <div style={{ background: "#111", color: "#fff", padding: "40px 0", marginTop: 50 }}>
                    <div className="container" style={{ width: "90%", margin: "0 auto" }}>
                        <Row gutter={[32, 32]} justify="space-between">

                            {/* Logo + Slogan */}
                            <Col xs={24} md={6}>
                                <h2 style={{ color: "#fff", marginBottom: 10, fontSize: 26 }}>
                                    HyperStyle Shoes
                                </h2>
                                <p style={{ color: "#bbb" }}>
                                    Phong cách – Tốc độ – Đẳng cấp.
                                </p>
                            </Col>

                            {/* Links */}
                            <Col xs={24} md={6}>
                                <h3 style={{ color: "#fff", marginBottom: 15, fontSize: 18 }}>Liên kết</h3>
                                <ul style={{ listStyle: "none", padding: 0, lineHeight: "32px" }}>
                                    <li><Link to="/" style={{ color: "#bbb" }}>Trang chủ</Link></li>
                                    <li><Link to="/#" style={{ color: "#bbb" }}>Sản phẩm</Link></li>
                                    <li><Link to="/#" style={{ color: "#bbb" }}>Về chúng tôi</Link></li>
                                    <li><Link to="/#" style={{ color: "#bbb" }}>Liên hệ</Link></li>
                                </ul>
                            </Col>

                            {/* Contact */}
                            <Col xs={24} md={6}>
                                <h3 style={{ color: "#fff", marginBottom: 15, fontSize: 18 }}>Liên hệ</h3>
                                <p style={{ color: "#bbb" }}>📍 125 Nguyễn Trãi, Hà Nội</p>
                                <p style={{ color: "#bbb" }}>📞 0987 123 456</p>
                                <p style={{ color: "#bbb" }}>✉️ hyperstyle.shoes@gmail.com</p>
                            </Col>

                            {/* Social */}
                            <Col xs={24} md={6}>
                                <h3 style={{ color: "#fff", marginBottom: 15, fontSize: 18 }}>Kết Nối Với Chúng Tôi</h3>
                                <div className="social-icons">
                                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: "#1677ff", marginRight: 8 }}>
                                        <FacebookOutlined />
                                    </a>
                                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: "#1677ff", marginRight: 8 }}>
                                        <TwitterOutlined />
                                    </a>
                                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={{ color: "#1677ff", marginRight: 8 }}>
                                        <YoutubeOutlined />
                                    </a>
                                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: "#1677ff", marginRight: 8 }}>
                                        <InstagramOutlined />
                                    </a>
                                </div>
                            </Col>

                        </Row>

                        <div style={{ textAlign: "center", marginTop: 30, color: "#777", fontSize: 14 }}>
                            © 2025 HyperStyle Shoes. All rights reserved.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashBoardCustomer;
