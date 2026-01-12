import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { LoginService } from "../../../services/LoginService";
import { useNavigate, Link } from "react-router-dom";

import { jwtDecode } from "jwt-decode";
import { saveUserFromToken, setAccessToken, setRefreshToken, clearAccessToken } from "../../../config/Cookies";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [formLogin, setFormLogin] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const actionShowPassword = () => {
        if (showPassword === false) {
            setShowPassword(true);
        } else {
            setShowPassword(false);
        }
    };
    const changeFormLogin = (name, value) => {
        setFormErrors({});
        setFormLogin((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const navigate = useNavigate();
    const onfinish = (form) => {
        clearAccessToken();
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const isFormValid =
            form.password && form.email && emailPattern.test(form.email);

        if (!isFormValid) {
            const errors = {
                password: !form.password ? "Vui lòng nhập mật khẩu" : "",
                email: !form.email
                    ? "Vui lòng nhập email"
                    : !emailPattern.test(form.email)
                        ? "Email không hợp lệ"
                        : "",
            };
            setFormErrors(errors);
            return;
        }
        LoginService.loginAccountService(form)
            .then(res => {
                console.log("Login response:", res.data);
                const loginData = jwtDecode(res.data.token);
                console.log("Check Roll:", loginData.roles)

                const accessToken = res.data.accessToken || res.data.token;
                const refreshToken = res.data.refreshToken;

                if (!accessToken) {
                    message.error("Access token không tồn tại");
                    return;
                }

                if (loginData.roles.includes("ROLE_ADMIN")) {

                    setAccessToken(accessToken);
                    setRefreshToken(refreshToken);
                    saveUserFromToken(accessToken);
                    // localStorage.setItem("idAccount", jwtDecode(accessToken).id);
                    sessionStorage.setItem("idAccount", jwtDecode(res.data.token).id);

                    // navigate("/dashboard");
                    navigate("/admin");
                    message.success("Đăng nhập thành công");
                } else if (loginData.roles.includes("ROLE_USER")) {
                    message.success("Bạn Không Có Quyền Truy Cập");
                }
            })
            .catch(err => {
                console.log(err);
                message.error("Đăng nhập thất bại");
            });




    };

    return (

        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #2d3748 0%, #4a5568 50%, #1a202c 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Background blur shapes */}
            <div
                style={{
                    position: "absolute",
                    top: "-50px",
                    right: "-50px",
                    width: "200px",
                    height: "200px",
                    background: "rgba(99, 179, 237, 0.1)",
                    borderRadius: "50%",
                    filter: "blur(40px)",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: "-100px",
                    left: "-100px",
                    width: "300px",
                    height: "300px",
                    background: "rgba(56, 161, 105, 0.1)",
                    borderRadius: "50%",
                    filter: "blur(60px)",
                }}
            />

            {/* Card */}
            <Card
                style={{
                    width: 450,
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                    borderRadius: "20px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    position: "relative",
                    zIndex: 1,
                }}
                bodyStyle={{ padding: "40px 40px 30px 40px" }}
            >
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: 35 }}>
                    <Title level={2} style={{ margin: 0, color: "#2d3748", fontWeight: 700, fontSize: "28px" }}>
                        HyperStyle
                    </Title>
                    <Text style={{ color: "#718096", fontSize: "16px", marginTop: "8px", display: "block" }}>
                        Chào mừng bạn! Đăng nhập ngay để tận hưởng trải nghiệm mua sắm cá nhân hóa và các ưu đãi độc quyền chỉ dành cho bạn.
                    </Text>
                </div>

                {/* Form */}
                <Form layout="vertical" onFinish={() => onfinish(formLogin)} autoComplete="off" size="large">
                    <Form.Item
                        label={<span style={{ color: "#2d3748", fontWeight: 600, fontSize: 15 }}>📧 Tài khoản:</span>}
                        validateStatus={formErrors.email ? "error" : ""}
                        help={formErrors.email || ""}
                    >
                        <Input
                            prefix={<UserOutlined style={{ color: "#718096" }} />}
                            placeholder="Nhập email hoặc tên đăng nhập"
                            style={{ borderRadius: "12px", border: "2px solid #e2e8f0", padding: "12px 16px", fontSize: 15 }}
                            onChange={(e) => changeFormLogin("email", e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ color: "#2d3748", fontWeight: 600, fontSize: 15 }}>🔐 Mật khẩu:</span>}
                        validateStatus={formErrors.password ? "error" : ""}
                        help={formErrors.password || ""}
                    >
                        <Input
                            type={showPassword ? "text" : "password"}
                            prefix={<LockOutlined style={{ color: "#718096" }} />}
                            placeholder="Nhập mật khẩu của bạn"
                            style={{ borderRadius: "12px", border: "2px solid #e2e8f0", padding: "12px 16px", fontSize: 15 }}
                            onChange={(e) => changeFormLogin("password", e.target.value)}
                        />
                        <FontAwesomeIcon
                            icon={showPassword ? faEye : faEyeSlash}
                            onClick={actionShowPassword}
                            style={{ marginLeft: 10, cursor: "pointer" }}
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                            style={{
                                height: "50px",
                                background: loading ? "#93c5fd" : "linear-gradient(135deg, #3182ce 0%, #2563eb 100%)",
                                border: "none",
                                borderRadius: "12px",
                                fontSize: 16,
                                fontWeight: 600,
                                boxShadow: "0 8px 20px rgba(49, 130, 206, 0.4)",
                            }}
                        >
                            {loading ? "🔄 Đang đăng nhập..." : "🚀 Đăng nhập hệ thống"}
                        </Button>
                    </Form.Item>
                </Form>

                {/* Footer */}
                <div style={{ textAlign: "center", marginTop: 25, paddingTop: 20, borderTop: "1px solid #e2e8f0" }}>
                </div>
            </Card>
        </div>

        // <div
        //     style={{
        //         minHeight: "100vh",
        //         background: "linear-gradient(135deg, #2d3748 0%, #4a5568 50%, #1a202c 100%)",
        //         display: "flex",
        //         alignItems: "center",
        //         justifyContent: "center",
        //         position: "relative",
        //         overflow: "hidden",
        //     }}
        // >
        //     {/* Background blur shapes */}
        //     <div
        //         style={{
        //             position: "absolute",
        //             top: "-50px",
        //             right: "-50px",
        //             width: "200px",
        //             height: "200px",
        //             background: "rgba(99, 179, 237, 0.1)",
        //             borderRadius: "50%",
        //             filter: "blur(40px)",
        //         }}
        //     />
        //     <div
        //         style={{
        //             position: "absolute",
        //             bottom: "-100px",
        //             left: "-100px",
        //             width: "300px",
        //             height: "300px",
        //             background: "rgba(56, 161, 105, 0.1)",
        //             borderRadius: "50%",
        //             filter: "blur(60px)",
        //         }}
        //     />

        //     {/* Card */}
        //     <Card
        //         style={{
        //             width: 450,
        //             background: "rgba(255, 255, 255, 0.95)",
        //             backdropFilter: "blur(20px)",
        //             boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
        //             borderRadius: "20px",
        //             border: "1px solid rgba(255, 255, 255, 0.2)",
        //             position: "relative",
        //             zIndex: 1,
        //         }}
        //         bodyStyle={{ padding: "40px 40px 30px 40px" }}
        //     >
        //         {/* Header */}
        //         <div style={{ textAlign: "center", marginBottom: 35 }}>
        //             <div
        //                 style={{
        //                     width: "80px",
        //                     height: "80px",
        //                     background: "linear-gradient(135deg, #3182ce 0%, #63b3ed 100%)",
        //                     borderRadius: "20px",
        //                     display: "flex",
        //                     alignItems: "center",
        //                     justifyContent: "center",
        //                     margin: "0 auto 20px auto",
        //                     boxShadow: "0 10px 30px rgba(49, 130, 206, 0.4)",
        //                 }}
        //             >
        //                 <HomeOutlined style={{ fontSize: 35, color: "white" }} />
        //             </div>
        //             <Title level={2} style={{ margin: 0, color: "#2d3748", fontWeight: 700, fontSize: "28px" }}>
        //                 HyperStyle
        //             </Title>
        //             <Text style={{ color: "#718096", fontSize: "16px", marginTop: "8px", display: "block" }}>
        //                 Chào mừng bạn! Đăng nhập ngay để tận hưởng trải nghiệm mua sắm cá nhân hóa và các ưu đãi độc quyền chỉ dành cho bạn.
        //             </Text>
        //         </div>

        //         {/* Form */}
        //         <Form layout="vertical" onFinish={() => onfinish(formLogin)} autoComplete="off" size="large">
        //             <Form.Item
        //                 label={<span style={{ color: "#2d3748", fontWeight: 600, fontSize: 15 }}>📧 Tài khoản:</span>}
        //                 validateStatus={formErrors.email ? "error" : ""}
        //                 help={formErrors.email || ""}
        //             >
        //                 <Input
        //                     prefix={<UserOutlined style={{ color: "#718096" }} />}
        //                     placeholder="Nhập email hoặc tên đăng nhập"
        //                     style={{ borderRadius: "12px", border: "2px solid #e2e8f0", padding: "12px 16px", fontSize: 15 }}
        //                     onChange={(e) => changeFormLogin("email", e.target.value)}
        //                 />
        //             </Form.Item>

        //             <Form.Item
        //                 label={<span style={{ color: "#2d3748", fontWeight: 600, fontSize: 15 }}>🔐 Mật khẩu:</span>}
        //                 validateStatus={formErrors.password ? "error" : ""}
        //                 help={formErrors.password || ""}
        //             >
        //                 <div style={{ position: "relative" }}>
        //                     <Input
        //                         type={showPassword ? "text" : "password"}
        //                         prefix={<LockOutlined style={{ color: "#718096" }} />}
        //                         placeholder="Nhập mật khẩu của bạn"
        //                         style={{
        //                             borderRadius: "12px",
        //                             border: "2px solid #e2e8f0",
        //                             padding: "12px 16px",
        //                             fontSize: 15,
        //                         }}
        //                         onChange={(e) => changeFormLogin("password", e.target.value)}
        //                     />
        //                     <FontAwesomeIcon
        //                         className="icon-show-password"
        //                         icon={showPassword ? faEye : faEyeSlash}
        //                         onClick={actionShowPassword}
        //                     />
        //                 </div>
        //             </Form.Item>


        //             <Form.Item style={{ marginBottom: 0 }}>
        //                 <Button
        //                     type="primary"
        //                     htmlType="submit"
        //                     block
        //                     loading={loading}
        //                     style={{
        //                         height: "50px",
        //                         background: loading ? "#93c5fd" : "linear-gradient(135deg, #3182ce 0%, #2563eb 100%)",
        //                         border: "none",
        //                         borderRadius: "12px",
        //                         fontSize: 16,
        //                         fontWeight: 600,
        //                         boxShadow: "0 8px 20px rgba(49, 130, 206, 0.4)",
        //                     }}
        //                 >
        //                     {loading ? "🔄 Đang đăng nhập..." : "🚀 Đăng nhập hệ thống"}
        //                 </Button>
        //             </Form.Item>
        //         </Form>

        //         {/* Footer */}
        //         <div style={{ textAlign: "center", marginTop: 25, paddingTop: 20, borderTop: "1px solid #e2e8f0" }}>
        //             <Text style={{ color: "#a0aec0", fontSize: 13 }}>© Copyright 2025, All rights reserved.</Text>
        //             <br />
        //             <Text style={{ color: "#a0aec0", fontSize: 13 }}>Phiên bản 1.0 - Bảo mật & Tin cậy</Text>
        //             <br />
        //             <Link to="/signup" style={{ marginTop: 8, display: "inline-block", color: "#3182ce" }}>
        //                 Bạn chưa có tài khoản? Đăng ký
        //             </Link>
        //         </div>
        //     </Card>
        // </div>

    );
}
export default Login;