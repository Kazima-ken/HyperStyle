import { useState, useEffect } from "react";
import { Row, Col, Spin, Button, Card } from "antd";
import { ArrowRightOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ProductApi } from "../../../api/admin/product/ProductApi";

// Giữ nguyên các import ảnh
import banner_Jordan from "./../../../image/Image-Jordan-1.jpg";
import banner_Basketball from "./../../../image/Image-Basketball.jpg";
import banner_PickleBall from "./../../../image/Image-Pickleball.jpg";
import banner1 from "./../../../image/mau-banner-giay-nu-1.jpg";
import banner2 from "./../../../image/4.png";
import banner3 from "./../../../image/5.png";
import small1 from "./../../../image/banner-small-1.jpg";
import small2 from "./../../../image/banner-small-2.jpg";
import small3 from "./../../../image/banner-small-3.jpg";

import "./Home.css";
import "./Banner.css";

function Home() {
    const [index, setIndex] = useState(0); // Chỉ số cho Banner chính
    const [productIndex, setProductIndex] = useState(0); // Chỉ số cho Slider sản phẩm
    const [listProduct, setListProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const slides = [banner1, banner2, banner3];
    const itemsToShow = 4; // Số sản phẩm hiển thị một lúc


    useEffect(() => {
        setLoading(true);
        ProductApi.getAll({ page: 0, size: 20 })
            .then((res) => {
                const rawData = res.data?.data;
                let finalData = Array.isArray(rawData) ? rawData : rawData?.content || [];

                // Gán giá giả để test UI, khi nào Backend có thì nó sẽ tự lấy giá thật
                finalData = finalData.map(item => ({
                    ...item,
                    price: item.price || 1850000 // Số tiền mặc định nếu null
                }));

                setListProduct(finalData);
            })
            .finally(() => setLoading(false));
    }, []);


    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => setIndex((index + 1) % slides.length);
    const prevSlide = () => setIndex((index - 1 + slides.length) % slides.length);

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
        <div className="home-modern">
            {/* SECTION 1: HERO BANNER (Layout mới, logic cũ) */}
            <div className="hero-banner-container">
                <div className="banner-main-wrapper">
                    <div className="banner-left-side">
                        <div
                            className="img-slide-active"
                            style={{ backgroundImage: `url(${slides[index]})` }}
                        >
                            <div className="hero-content">
                                <h3>NEW ARRIVALS 2026</h3>
                                <h1>NIKE AIR <br /> PERFORMANCE</h1>
                                <button className="btn-explore" onClick={() => navigate("/products")}>
                                    SHOP NOW <ArrowRightOutlined />
                                </button>
                            </div>
                        </div>

                        {/* Nút bấm Banner */}
                        <button className="banner-nav prev" onClick={prevSlide}><LeftOutlined /></button>
                        <button className="banner-nav next" onClick={nextSlide}><RightOutlined /></button>

                        {/* Dots chuẩn */}
                        <div className="banner-dots">
                            {slides.map((_, i) => (
                                <span
                                    key={i}
                                    className={`dot-item ${i === index ? "active" : ""}`}
                                    onClick={() => setIndex(i)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="banner-right-side">
                        <div className="side-img-box"><img src={small1} alt="Small 1" /></div>
                        <div className="side-img-box"><img src={small2} alt="Small 2" /></div>
                        <div className="side-img-box"><img src={small3} alt="Small 3" /></div>
                    </div>
                </div>
            </div>

            {/* SECTION 2: PRODUCT SLIDER (Logic trượt mượt mà) */}
            <section className="product-section">
                <div className="section-header-modern">
                    <h2>TRENDING NOW</h2>
                    <div className="nav-controls">
                        <button onClick={prevProduct} disabled={productIndex === 0}><LeftOutlined /></button>
                        <button onClick={nextProduct} disabled={productIndex >= listProduct.length - itemsToShow}><RightOutlined /></button>
                    </div>
                </div>

                {loading ? <div className="loader"><Spin size="large" /></div> : (
                    <div className="slider-viewport">
                        <div
                            className="slider-track"
                            style={{ transform: `translateX(-${productIndex * (100 / itemsToShow)}%)` }}
                        >
                            {listProduct.map((item, idx) => (
                                <div
                                    className="product-item-card"
                                    key={idx}
                                    style={{ width: `${100 / itemsToShow}%` }}
                                >
                                    {/* THÊM SỰ KIỆN CLICK VÀO ĐÂY */}
                                    <div
                                        className="card-inner"
                                        onClick={() => navigate(`/detail-product/${item.id}`)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <div className="image-holder">
                                            <img src={item.image} alt={item.name} />
                                            <div className="quick-view">CHI TIẾT</div>
                                        </div>
                                        <div className="info-holder">
                                            <span className="brand-label">{item.nameBrand}</span>
                                            <h4>{item.name}</h4>
                                            <p className="price-label">
                                                {item.price
                                                    ? item.price.toLocaleString('vi-VN') + " đ"
                                                    : "Giá đang cập nhật"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* SECTION 3: CATEGORY BANNERS */}
            <section className="cat-banners">
                <Row gutter={[20, 20]}>
                    <Col span={16}>
                        <div className="cat-item large" style={{ backgroundImage: `url(${banner_Jordan})` }}>
                            <div className="cat-text"><h2>JORDAN SERIES</h2></div>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div className="cat-item small" style={{ backgroundImage: `url(${banner_PickleBall})` }}>
                            <div className="cat-text"><h3>PICKLEBALL</h3></div>
                        </div>
                        <div className="cat-item small" style={{ backgroundImage: `url(${banner_Basketball})`, marginTop: '20px' }}>
                            <div className="cat-text"><h3>BASKETBALL</h3></div>
                        </div>
                    </Col>
                </Row>
            </section>
        </div>
    );
}

export default Home;