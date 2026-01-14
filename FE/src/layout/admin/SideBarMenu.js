import React, { useEffect, useState } from "react";
import { Layout, Menu } from 'antd';
import { Link, useNavigate } from "react-router-dom";
import logo from '../../image/logo_banner_2.png';
import SubMenu from "antd/es/menu/SubMenu";
import { jwtDecode } from "jwt-decode";
import { getCookie } from "../../config/CookiesRequest";

const { Sider } = Layout;

const SidebarMenu = () => {

    const [user, setUser] = useState(null);
    const navigator = useNavigate();
    const token = getCookie("accessToken");

    const loadUser = () => {
        if (!token || typeof token !== "string") return;

        const loginData = jwtDecode(token);
        setUser({
            id: loginData.id,
            email: loginData.email,
            roles: loginData.roles,
            fullName: loginData.fullName,
            avata: loginData.avata,
            expirationTime: new Date(loginData.exp * 1000),
        });
    };


    useEffect(() => {
        if (token) {
            loadUser();
        }
    }, [token]);


    const isAdmin = user?.roles?.includes("ROLE_ADMIN");


    return (
        <div style={{
            width: "280px",
            height: "100vh",
            background: 'linear-gradient(180deg, #2d3748 0%, #1a202c 100%)',
            boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{
                padding: '20px',
                textAlign: 'center',
                borderBottom: '1px solid #4a5568',
                flexShrink: 0, // Không co lại khi scroll
                background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)'
            }}>
                <img
                    src={logo}
                    alt="Logo"
                    style={{
                        width: '80px',
                        height: 'auto',
                        marginBottom: '10px',
                        borderRadius: '8px'
                    }}
                />
                <p style={{
                    color: '#a0aec0',
                    fontSize: '12px',
                    margin: '5px 0 0 0'
                }}>
                    Hệ thống quản lý toàn diện
                </p>
            </div>

            <div style={{
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                padding: '10px 0'
            }}>
                <Sider
                    width={280}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        height: '100%'
                    }}
                >
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['2']}
                        style={{
                            height: '100%',
                            border: 'none',
                            background: 'transparent',
                            padding: '0 10px'
                        }}
                        theme="dark"
                        onClick={({ key }) => {
                            switch (key) {
                                case '1':
                                    navigator('/dashboard');
                                    break;
                                case '2':
                                    navigator('');
                                    break;
                                case '3':
                                    navigator('/product-management');
                                    break;
                                case '4':
                                    navigator('/category-management');
                                    break;
                                case '5':
                                    navigator('/brand-management');
                                    break;
                                case '6':
                                    navigator('/material-management');
                                    break;
                                case '7':
                                    navigator('/sole-management');
                                    break;
                                case '8':
                                    navigator('/bill-management');
                                    break;
                                case '9':
                                    navigator('/customer-management');
                                    break;
                                case '10':
                                    navigator('/staff-management');
                                    break;
                                case '11':
                                    navigator('/dashboard');
                                    break;
                                default:
                                    break;
                            }
                        }}
                    >

                        <Menu.Item
                            key="8"
                            style={{
                                color: '#f7fafc',
                                fontSize: '14px',
                                height: '45px',
                                lineHeight: '45px',
                                margin: '4px 0',
                                borderRadius: '8px',
                                marginTop: '180px'
                            }}
                        >
                            🧾 Quản lý hóa đơn
                        </Menu.Item>

                        {isAdmin && (
                            <SubMenu
                                title="📦 Quản Lý Sản Phẩm"
                                style={{
                                    color: '#f7fafc',
                                }}>
                                <Menu.Item key="3"
                                    style={{
                                        color: '#f7fafc',
                                    }}>
                                    Sản Phẩm
                                </Menu.Item>
                                <Menu.Item key="4"
                                    style={{
                                        color: '#f7fafc',
                                    }}>
                                    Danh Mục
                                </Menu.Item>
                                <Menu.Item key="5"
                                    style={{
                                        color: '#f7fafc',
                                    }}>
                                    Thương Hiệu
                                </Menu.Item>
                                <Menu.Item key="6"
                                    style={{
                                        color: '#f7fafc',
                                    }}>
                                    Chất Liệu
                                </Menu.Item>
                                <Menu.Item key="7"
                                    style={{
                                        color: '#f7fafc',
                                    }}>
                                    Đế Giày
                                </Menu.Item>
                            </SubMenu>

                        )}

                        <Menu.Item
                            key="9"
                            style={{
                                color: '#f7fafc',
                                fontSize: '14px',
                                height: '45px',
                                lineHeight: '45px',
                                margin: '4px 0',
                                borderRadius: '8px'
                            }}
                        >
                            👥 Quản lý khách hàng
                        </Menu.Item>

                        {isAdmin && (
                            <Menu.Item
                                key="10"
                                style={{
                                    color: '#f7fafc',
                                    fontSize: '14px',
                                    height: '45px',
                                    lineHeight: '45px',
                                    margin: '4px 0',
                                    borderRadius: '8px'
                                }}
                            >
                                👨🏻‍💼 Quản lý Nhân Viên
                            </Menu.Item>
                        )}

                    </Menu>
                </Sider>
            </div>

            {/* Custom CSS cho hover effect và scrollbar */}
            <style jsx>{`
        /* Menu hover effects */
        .ant-menu-dark .ant-menu-item:hover {
          background-color: #4a5568 !important;
          border-left: 3px solid #63b3ed !important;
          transform: translateX(5px);
        }

        .ant-menu-dark .ant-menu-submenu-title:hover {
          background-color: #4a5568 !important;
          border-left: 3px solid #63b3ed !important;
          transform: translateX(5px);
        }


        .ant-menu-dark .ant-menu-submenu > .ant-menu-submenu-title {
        color: #f7fafc;
        }

        // .ant-menu-dark .ant-menu-submenu .ant-menu-sub {
        //  background: linear-gradient(180deg, #242C3B 0%, #1D2330 100%) !important;
        // }
        
        .ant-menu-dark,
        .ant-menu-dark .ant-menu-submenu,
        .ant-menu-dark .ant-menu-sub,
        .ant-menu-dark .ant-menu-submenu-title {
         background: transparent !important;
        }


        
        .ant-menu-dark .ant-menu-item-selected {
          background-color: #3182ce !important;
          border-left: 3px solid #63b3ed !important;
          transform: translateX(5px);
        }
        
        .ant-menu-dark .ant-menu-item {
          border-left: 3px solid transparent; 
          transition: all 0.3s ease;
        }
        
        .ant-menu-dark .ant-menu-item-active {
          background-color: #4a5568 !important;
        }
        
        /* Custom scrollbar cho sidebar menu */
        .ant-layout-sider ::-webkit-scrollbar {
          width: 6px;
        }
        
        .ant-layout-sider ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        
        .ant-layout-sider ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        
        .ant-layout-sider ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
        
        /* Smooth scroll */
        .ant-layout-sider {
          scroll-behavior: smooth;
        }
        
        /* Animation cho menu items */
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .ant-menu-item {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
        </div>
    )
};

export default SidebarMenu;