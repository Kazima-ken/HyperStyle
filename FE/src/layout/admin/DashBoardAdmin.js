import React, { useEffect, useState } from "react";
import { Layout, Dropdown, Menu, message, Modal, Avatar } from "antd";
import { UserOutlined, LockOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import SidebarMenu from "./SideBarMenu";
import { clearAuth } from "../../config/Cookies";
import { getCookie } from "../../config/CookiesRequest";
import { jwtDecode } from "jwt-decode";

const { Content } = Layout;

const DashBoardAdmin = ({ children }) => {

    const [time, setTime] = useState(new Date());
    const userName = localStorage.getItem("userName") || "Người dùng";
    const navigate = useNavigate();
    const [modalChangePassword, setModalChangePassword] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) =>
        date.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });

    const formatDate = (date) =>
        date.toLocaleDateString("vi-VN", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

    const handleMenuClick = (e) => {
        if (e.key === "logout") {
            Modal.confirm({
                title: '🚪 Đăng xuất',
                content: 'Bạn có chắc muốn đăng xuất khỏi hệ thống?',
                okText: 'Đăng xuất',
                cancelText: 'Hủy',
                okType: 'danger',
                centered: true,
                onOk: async () => {
                    try {
                        clearAuth();
                        message.success("Đăng xuất thành công!");
                        sessionStorage.removeItem("idAccount");
                        navigate("/login-management");
                    } catch (error) {
                        message.error("Đăng xuất thất bại. Vui lòng thử lại sau!");
                    }
                }
            });
        } else if (e.key === "changePassword") {
            setModalChangePassword(true);
        }
    };

    const userMenu = (
        <Menu
            onClick={handleMenuClick}
            style={{
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                border: '1px solid #e8e8e8'
            }}
        >
            <Menu.Item
                key="changePassword"
                icon={<LockOutlined />}
                style={{
                    fontSize: '14px',
                    padding: '10px 16px'
                }}
            >
                Đổi mật khẩu
            </Menu.Item>
            <Menu.Item
                key="logout"
                icon={<LogoutOutlined />}
                style={{
                    fontSize: '14px',
                    padding: '10px 16px',
                    color: '#ef4444'
                }}
            >
                Đăng xuất
            </Menu.Item>
        </Menu>
    );

    return (
        <Layout style={{ minHeight: "100vh", background: '#f8f9fa' }}>
            {/* Fixed Sidebar Menu */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 1000,
                height: '100vh',
                width: '280px'
            }}>
                <SidebarMenu />
            </div>

            {/* Main Layout với margin-left để tránh bị sidebar che */}
            <Layout style={{
                background: '#f8f9fa',
                marginLeft: '280px', // Để dành chỗ cho fixed sidebar
                minHeight: '100vh'
            }}>
                {/* Fixed Header Bar */}
                <div
                    style={{
                        position: 'sticky', // Sử dụng sticky thay vì fixed để header luôn ở đầu khi scroll
                        top: 0,
                        zIndex: 999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                        padding: "16px 30px",
                        margin: "20px 20px 0 20px",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        border: "1px solid #e2e8f0",
                        backdropFilter: 'blur(10px)', // Thêm hiệu ứng blur
                    }}
                >
                    {/* Thời gian thực */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                            background: 'linear-gradient(45deg, #3182ce, #63b3ed)',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            marginRight: '15px',
                            boxShadow: '0 2px 8px rgba(49, 130, 206, 0.3)'
                        }}>
                            🕐 {formatTime(time)}
                        </div>
                    </div>

                    {/* Ngày tháng */}
                    <div style={{
                        color: '#2d3748',
                        fontSize: '15px',
                        fontWeight: '500',
                        textAlign: 'center',
                        flex: 1
                    }}>
                        📅 {formatDate(time)}
                    </div>

                    {/* User Menu */}
                    <Dropdown
                        overlay={userMenu}
                        placement="bottomRight"
                        trigger={["hover"]}
                        arrow={{ pointAtCenter: true }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                background: 'linear-gradient(45deg, #f0f9ff, #e0f2fe)',
                                padding: '8px 16px',
                                borderRadius: '25px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                border: '2px solid #e0f2fe',
                                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.15)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.25)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.15)';
                            }}
                        >
                            <Avatar
                                size={32}
                                icon={<UserOutlined />}
                                style={{
                                    background: 'linear-gradient(45deg, #3b82f6, #60a5fa)',
                                    marginRight: '10px'
                                }}
                            />
                            <span style={{
                                fontWeight: '600',
                                color: '#1e40af',
                                fontSize: '14px'
                            }}>
                                👋 {userName}
                            </span>
                        </div>
                    </Dropdown>
                </div>

                {/* Scrollable Content Area */}
                <div style={{
                    flex: 1,
                    overflow: 'auto', // Cho phép scroll trong vùng này
                    padding: '0 20px 20px 20px'
                }}>
                    <Content
                        style={{
                            padding: '20px',
                            marginTop: '15px',
                            background: '#ffffff',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            border: '1px solid #e2e8f0',
                            minHeight: 'calc(100vh - 140px)' // Điều chỉnh chiều cao để tránh overflow
                        }}
                    >
                        <div style={{
                            background: '#ffffff',
                            minHeight: '100%',
                            borderRadius: '8px'
                        }}>
                            {children}
                        </div>
                    </Content>
                </div>
            </Layout>

            {/* <ModalChangePassword
                visible={modalChangePassword}
                onclose={() => setModalChangePassword(false)}
            /> */}

            {/* Custom CSS cho animations và scrollbar */}
            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .ant-layout-content {
          animation: fadeIn 0.3s ease-out;
        }
        
        .ant-dropdown {
          animation: fadeIn 0.2s ease-out;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #cbd5e0, #a0aec0);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #a0aec0, #718096);
        }
        
        /* Đảm bảo sidebar không bị ảnh hưởng bởi scroll */
        .ant-layout-sider {
          position: fixed !important;
          left: 0 !important;
          top: 0 !important;
          height: 100vh !important;
          z-index: 1000 !important;
        }
      `}</style>
        </Layout>
    );
};

export default DashBoardAdmin;