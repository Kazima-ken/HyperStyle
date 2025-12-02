import { useState, useEffect } from "react";
import { Row, Col, Menu, Tabs, Pagination, Card } from "antd";
import { RiseOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import banner_Jordan from "./../../../assets/Image-Jordan-1.jpg";
import banner_Basketball from "./../../../assets/Image-Basketball.jpg";
import banner_PickleBall from "./../../../assets/Image-Pickleball.jpg";
import banner1 from "./../../../assets/mau-banner-giay-nu-1.jpg";
import banner2 from "./../../../assets/4.png";
import banner3 from "./../../../assets/5.png";
import small1 from "./../../../assets/banner-small-1.jpg";
import small2 from "./../../../assets/banner-small-2.jpg";
import small3 from "./../../../assets/banner-small-3.jpg";
import "./Home.css";
import "./Banner.css"


function Home() {

    const [index, setIndex] = useState(0);


    const fields = [
        {
            className: "title-baner",
            title: "MUA GIÀY JORDAN",
            href: "/products",
            Image: banner_Jordan,
        },
        {
            className: "title-baner",
            title: "MUA GIÀY PICKLEBALL",
            href: "/products",
            Image: banner_PickleBall,
        },
        {
            className: "title-baner",
            title: "MUA GIÀY BÓNG RỔ",
            href: "/products",
            Image: banner_Basketball,
        },
    ];

    const slides = [banner1, banner2, banner3];


    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % slides.length);
        }, 4000);

        return () => clearInterval(timer);
    }, [index, slides.length]);

    const prevSlide = () => setIndex((index - 1 + slides.length) % slides.length);
    const nextSlide = () => setIndex((index + 1) % slides.length);

    return (
        <div className="home">
            <div className="banner">
                <div className="banner-left">
                    <div
                        className="img-banner-home"
                        style={{ backgroundImage: `url(${slides[index]})` }}
                    ></div>

                    <button className="nav-btn prev" onClick={prevSlide}>❮</button>
                    <button className="nav-btn next" onClick={nextSlide}>❯</button>

                    <div className="dots">
                        {slides.map((_, i) => (
                            <span
                                key={i}
                                className={`dot ${i === index ? "active" : ""}`}
                                onClick={() => setIndex(i)}
                            ></span>
                        ))}
                    </div>
                </div>

                <div className="banner-right">
                    <img src={small1} alt="" />
                    <img src={small2} alt="" />
                    <img src={small3} alt="" />
                </div>
            </div>

            <div>
                <Row justify="center">
                    <Col className="col-choose" lg={{ span: 18 }}>
                        <div className="banner-container">
                            {fields.map((field, index) => (
                                <div key={index} className={`banner-item title-baner`}>
                                    <Link to={field.href} className="banner-link">
                                        <img
                                            src={field.Image}
                                            alt={field.title}
                                            className="banner-image"
                                        />
                                    </Link>
                                    <p className="banner-title">{field.title}</p>
                                </div>
                            ))}
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default Home;