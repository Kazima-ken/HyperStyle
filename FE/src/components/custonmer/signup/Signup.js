import React, { useState } from "react";
import { Form, Input, Button, Card, Typography } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { LoginService } from "../../../services/LoginService";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./Signup.css"
import { LockOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [formLogin, setFormLogin] = useState({
        roles: "ROLE_USER",
    });
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const actionShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const changeFormLogin = (name, value) => {
        setFormErrors({});
        setFormLogin((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const onfinish = () => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const passPattern = /^(?=.*[0-9])(.{8,})$/;
        const phonePattern = /^0\d{9}$/;

        const isFormValid =
            formLogin.email && formLogin.password && formLogin.numberPhone;

        if (!isFormValid) {
            const errors = {
                email: !formLogin.email ? "Vui lòng nhập email" : "",
                numberPhone: !formLogin.numberPhone ? "Vui lòng nhập số điện thoại" : "",
                password: !formLogin.password ? "Vui lòng nhập mật khẩu" : "",
            };
            setFormErrors(errors);
            return;
        }

        const errors = {
            email: !emailPattern.test(formLogin.email)
                ? "Vui lòng nhập đúng định dạng email"
                : "",
            numberPhone: !phonePattern.test(formLogin.numberPhone)
                ? "Vui lòng nhập đúng định dạng số điện thoại"
                : "",
            password: !passPattern.test(formLogin.password)
                ? "Mật khẩu phải có ít nhất 8 ký tự và có ít nhất 1 số"
                : "",
        };

        if (errors.email || errors.numberPhone || errors.password) {
            setFormErrors(errors);
            return;
        }

        setLoading(true);
        console.log("DATA GUI LEN:", formLogin);
        LoginService.SignupAccountService(formLogin)
            .then((res) => {
                toast.success("Đăng ký thành công");
                navigate("/login");
            })
            .catch((err) => {
                const message = err?.response?.data?.message;
                const data = err?.response?.data?.data;

                if (message === "Email người dùng đã tồn tại") {
                    setFormErrors((prev) => ({
                        ...prev,
                        email: message,
                    }));
                } else if (message === "Số điện thoại đã được sử dụng.") {
                    setFormErrors((prev) => ({
                        ...prev,
                        numberPhone: data,
                    }));
                } else if (data) {
                    setFormErrors((prev) => ({
                        ...prev,
                        password: data,
                    }));
                }
            })
            .finally(() => setLoading(false));
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
            <Card
                style={{
                    width: 450,
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(20px)",
                    borderRadius: "20px",
                }}
                bodyStyle={{ padding: "40px" }}
            >
                <div style={{ textAlign: "center", marginBottom: 35 }}>
                    <Title level={2} style={{ margin: 0, color: "#2d3748", fontWeight: 700 }}>
                        HyperStyle
                    </Title>
                    <Text style={{ color: "#718096" }}>
                        Tạo tài khoản mới cho hệ thống.
                    </Text>
                </div>

                <Form layout="vertical" onFinish={onfinish} autoComplete="off" size="large">
                    <Form.Item
                        label="📧 Email:"
                        validateStatus={formErrors.email ? "error" : ""}
                        help={formErrors.email || ""}
                    >
                        <Input
                            prefix={<UserOutlined style={{ color: "#718096" }} />}
                            placeholder="Nhập email"
                            style={{ borderRadius: "12px", border: "2px solid #e2e8f0" }}
                            onChange={(e) => changeFormLogin("email", e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item
                        label="📱 Số điện thoại:"
                        validateStatus={formErrors.numberPhone ? "error" : ""}
                        help={formErrors.numberPhone || ""}
                    >
                        <Input
                            prefix={<PhoneOutlined style={{ color: "#718096" }} />}
                            placeholder="Nhập số điện thoại"
                            style={{ borderRadius: "12px", border: "2px solid #e2e8f0" }}
                            onChange={(e) => changeFormLogin("numberPhone", e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item
                        label="🔐 Mật khẩu:"
                        validateStatus={formErrors.password ? "error" : ""}
                        help={formErrors.password || ""}
                    >
                        <Input
                            type={showPassword ? "text" : "password"}
                            prefix={<LockOutlined style={{ color: "#718096" }} />}
                            placeholder="Nhập mật khẩu"
                            style={{ borderRadius: "12px", border: "2px solid #e2e8f0" }}
                            onChange={(e) => changeFormLogin("password", e.target.value)}
                        />
                        <FontAwesomeIcon
                            icon={showPassword ? faEye : faEyeSlash}
                            onClick={actionShowPassword}
                            style={{ marginLeft: 10, cursor: "pointer" }}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                            style={{
                                height: "50px",
                                background: "linear-gradient(135deg, #3182ce 0%, #2563eb 100%)",
                                border: "none",
                                borderRadius: "12px",
                                fontSize: 16,
                                fontWeight: 600,
                            }}
                        >
                            {loading ? "🔄 Đang đăng ký..." : "🚀 Tạo tài khoản"}
                        </Button>
                    </Form.Item>
                </Form>

                <div style={{ textAlign: "center", marginTop: 20 }}>
                    <Text style={{ color: "#718096" }}>
                        Bạn đã có tài khoản?
                        <Link to="/login" style={{ color: "#3182ce", marginLeft: 5 }}>
                            Đăng nhập
                        </Link>
                    </Text>
                </div>
            </Card>
        </div>
    );
}

export default Signup;