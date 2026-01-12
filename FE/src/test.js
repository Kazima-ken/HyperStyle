import { useState, useEffect } from "react";
import { Row, Col, Card, Spin, message } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { ProductApi } from "../../../api/ProductApi";
import "./Home.css";

function Home() {
    const [listProduct, setListProduct] = useState([]);
    const [loading, setLoading] = useState(false);
    const [productIndex, setProductIndex] = useState(0); 
    const itemsToShow = 5;

    const loadDataHome = () => {
        setLoading(true);
        // Gọi API với params trống để lấy danh sách
        ProductApi.getAll({}).then(
            (response) => {
                const dataFromServer = response.data?.data;
                // Xử lý cả 2 trường hợp: mảng trực tiếp hoặc đối tượng Page (có .content)
                if (Array.isArray(dataFromServer)) {
                    setListProduct(dataFromServer);
                } else if (dataFromServer?.content) {
                    setListProduct(dataFromServer.content);
                }
                setLoading(false);
            },
            (err) => {
                console.error("Vẫn lỗi 403. Kiểm tra lại Backend permitAll:", err);
                setLoading(false);
            }
        );
    };

    useEffect(() => {
        loadDataHome();
    }, []);

    const nextProduct = () => {
        if (productIndex < listProduct.length - itemsToShow) {
            setProductIndex(productIndex + 1);
        }
    };

    const prevProduct = () => {
        if (productIndex > 0) {
            setProductIndex(productIndex - 1);
        }
    };

    return (
        <div className="home">
            {/* ... Giữ các banner cũ của bạn ... */}

            <div className="product-carousel-container" style={{ padding: "40px 10%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                    <h2 style={{ textTransform: "uppercase", fontWeight: "bold" }}>Sản phẩm mới</h2>
                    <div className="carousel-nav">
                        <button className="nav-btn-round" onClick={prevProduct} disabled={productIndex === 0}>
                            <LeftOutlined />
                        </button>
                        <button className="nav-btn-round" onClick={nextProduct} disabled={productIndex >= listProduct.length - itemsToShow}>
                            <RightOutlined />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: "center" }}><Spin size="large" /></div>
                ) : (
                    <div className="product-window">
                        <div 
                            className="product-track" 
                            style={{ 
                                display: "flex",
                                transition: "transform 0.5s ease",
                                transform: `translateX(-${productIndex * (100 / itemsToShow)}%)` 
                            }}
                        >
                            {listProduct.map((item) => (
                                <div key={item.id} className="product-card-wrapper">
                                    <Card
                                        hoverable
                                        cover={<img alt={item.name} src={item.image} style={{ height: "250px", objectFit: "cover" }} />}
                                    >
                                        <Card.Meta title={item.name} description={<b style={{color: '#f5222d'}}>{item.nameBrand}</b>} />
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;