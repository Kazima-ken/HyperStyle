import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import robot from "../../image/robot.png";

export default function NotFound() {
    const navigate = useNavigate();

    const handleBackHome = () => {
        if (window.history.length > 1) navigate(-1);
        else navigate("/home");

    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                textAlign: "center",
                backgroundColor: "#f0f2f5",
            }}
        >
            <img
                src={robot}
                alt="Robot"
                style={{ width: 250, marginBottom: 20 }}
            />
            <h1 style={{ fontSize: 80, margin: 0 }}>404</h1>
            <p style={{ fontSize: 20, color: "#555", marginBottom: 30 }}>
                Trang bạn truy cập không tồn tại.
            </p>
            <Button type="primary" onClick={handleBackHome}>
                Quay Lại
            </Button>
        </div>
    );
}