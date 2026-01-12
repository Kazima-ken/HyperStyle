import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Col, InputNumber, Row, Button, Spin, Tag, Divider, message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faRetweet,
    faTruckFast,
    faFileInvoiceDollar,
    faShieldHeart,
    faCheckCircle
} from "@fortawesome/free-solid-svg-icons";
import { ProductDetailApi } from "../../../api/admin/productDetail/productDetailApi";
import { CartApi } from "../../../api/customer/card/CardApi";
import "./prDetail.css";
import { useCart } from '../../custonmer/cart/CartService';

// Hàm format tiền tệ an toàn
const formatMoney = (value) => {
    if (value === undefined || value === null || isNaN(value)) return "0 đ";
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(value);
};

function ProductDetailCustomer() {
    const { id } = useParams(); // id này là idProduct
    const navigate = useNavigate();
    const idAccountLocal = sessionStorage.getItem("idAccount");

    // --- STATE ---
    const [productData, setProductData] = useState(null);
    const [loading, setLoading] = useState(true);

    // State cho lựa chọn của khách hàng
    const [selectedColorId, setSelectedColorId] = useState(null);
    const [selectedSizeId, setSelectedSizeId] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [infoTab, setInfoTab] = useState(1);
    const { updateTotalQuantity } = useCart();

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                // Gọi API lấy dữ liệu theo cấu trúc JSON mới
                const res = await ProductDetailApi.getOneClient(id);
                if (res.data && res.data.data) {
                    const data = res.data.data;
                    setProductData(data);

                    // Logic tự động chọn màu/size đầu tiên (nếu muốn)
                    // if (data.listColors?.length > 0) setSelectedColorId(data.listColors[0].id);
                    // if (data.listSizes?.length > 0) setSelectedSizeId(data.listSizes[0].id);
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                message.error("Không thể tải thông tin sản phẩm!");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
        setQuantity(1);
    }, [id]);

    // --- LOGIC TÍNH TOÁN BIẾN THỂ (VARIANT) ---
    // Tìm variant dựa trên Color ID và Size ID đang chọn
    const activeVariant = productData?.listVariants?.find(variant =>
        variant.idColor === selectedColorId && variant.idSize === selectedSizeId
    );

    // Xác định thông tin hiển thị
    const displayPrice = activeVariant ? activeVariant.price : productData?.priceDefault;
    const maxQuantity = activeVariant ? activeVariant.quantity : 0;
    const isVariantSelected = !!activeVariant; // Đã chọn đủ màu và size hợp lệ chưa


    // --- HANDLERS ---
    const handleAddToCart = async () => {
        // 1. Lấy thông tin tài khoản
        const idAccountLocal = sessionStorage.getItem("idAccount");
        const isValidAccount = idAccountLocal && idAccountLocal !== "undefined" && idAccountLocal !== "null";

        // 2. QUAN TRỌNG: Kiểm tra xem đã chọn biến thể chưa TRƯỚC KHI làm bất cứ việc gì khác
        // Điều này ngăn lỗi "Cannot read properties of undefined (reading 'id')"
        if (!selectedColorId || !selectedSizeId || !activeVariant) {
            message.warning("Vui lòng chọn Màu sắc và Kích thước!");
            return;
        }

        // 3. Chuẩn bị dữ liệu sản phẩm (Dùng chung cho cả 2 trường hợp)
        // Lưu ý: Dùng activeVariant.idProductDetail hoặc activeVariant.id tùy theo cấu trúc object của bạn
        const cartItemData = {
            idProductDetail: activeVariant.idProductDetail || activeVariant.id,
            price: activeVariant.price,
            quantity: quantity,
            image: productData.image || "",
            nameProduct: productData.nameProduct,
            nameColor: productData.listColors.find(c => c.id === selectedColorId)?.name,
            nameSize: productData.listSizes.find(s => s.id === selectedSizeId)?.name,
        };

        if (isValidAccount) {
            // --- TRƯỜNG HỢP CÓ TÀI KHOẢN (DATABASE) ---
            try {
                await CartApi.addCart({
                    idAccount: idAccountLocal,
                    idProductDetail: cartItemData.idProductDetail,
                    price: cartItemData.price,
                    quantity: cartItemData.quantity
                });

                message.success("Đã thêm vào giỏ hàng!");

                // Cập nhật số lượng Badge từ Backend
                const resRes = await CartApi.quantityInCart(idAccountLocal);
                if (resRes.data && resRes.data.data !== undefined) {
                    updateTotalQuantity(resRes.data.data);
                }
            } catch (error) {
                console.error(error);
                // Nếu lỗi 403 hoặc 500 từ DB (Duplicate entry), thông báo lỗi tại đây
                message.error("Lỗi khi thêm vào giỏ hàng!");
            }
        } else {
            // --- TRƯỜNG HỢP VÃNG LAI (LOCAL STORAGE) ---
            let cartLocal = JSON.parse(localStorage.getItem("cartLocal")) || [];
            const existingItemIndex = cartLocal.findIndex(item => item.idProductDetail === cartItemData.idProductDetail);

            if (existingItemIndex !== -1) {
                const newQty = cartLocal[existingItemIndex].quantity + quantity;
                if (newQty > (activeVariant.quantity || 99)) { // Kiểm tra tồn kho nếu có
                    message.warning(`Tổng số lượng vượt quá tồn kho!`);
                    return;
                }
                cartLocal[existingItemIndex].quantity = newQty;
            } else {
                cartLocal.push(cartItemData);
            }

            localStorage.setItem("cartLocal", JSON.stringify(cartLocal));
            message.success("Đã thêm vào giỏ hàng!");

            const total = cartLocal.reduce((acc, item) => acc + item.quantity, 0);
            updateTotalQuantity(total);
            window.dispatchEvent(new Event("storage"));
        }
    };
    if (loading) return <div style={{ height: "60vh", display: "flex", justifyContent: "center", alignItems: "center" }}><Spin size="large" /></div>;
    if (!productData) return <div className="text-center mt-5">Sản phẩm không tồn tại</div>;

    return (
        <div className="product-detail-container">
            <Row gutter={0}> {/* Gutter 0 để ta tự xử lý padding */}

                {/* --- CỘT TRÁI: ẢNH (Khoảng 45%) --- */}
                <Col xs={24} lg={11}>
                    <div className="img-main-wrapper">
                        <img
                            className="img-detail-product-pd"
                            src={productData.image || "https://via.placeholder.com/500"}
                            alt={productData.nameProduct}
                        />
                    </div>
                </Col>

                {/* --- CỘT PHẢI: THÔNG TIN (Khoảng 55% + Padding 3cm) --- */}
                <Col xs={24} lg={13}>
                    <div className="product-info-wrapper">

                        {/* 1. Tên sản phẩm */}
                        <div className="info-block">
                            <h1 className="product-title">{productData.nameProduct}</h1>
                            <div className="product-meta">
                                <span>Thương hiệu: <b>{productData.nameBrand}</b></span>
                                <span>|</span>
                                <span>Mã SP: <b>{productData.codeProduct}</b></span>
                            </div>
                        </div>

                        {/* 2. Giá tiền */}
                        <div className="info-block price-box">
                            <span className="current-price">{formatMoney(displayPrice)}</span>
                        </div>

                        {/* 3. Chọn Màu sắc */}
                        <div className="info-block">
                            <span className="option-label">Màu sắc: <span className="fw-normal">{productData.listColors.find(c => c.id === selectedColorId)?.name}</span></span>
                            <div className="color-option-container">
                                {productData.listColors.map((color) => (
                                    <div
                                        key={color.id}
                                        className={`color-box-display ${selectedColorId === color.id ? 'selected' : ''}`}
                                        style={{ backgroundColor: color.value }}
                                        onClick={() => setSelectedColorId(color.id)}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* 4. Chọn Kích thước */}
                        <div className="info-block">
                            <div className="d-flex justify-content-between align-items-center mb-2" style={{ maxWidth: '400px' }}>
                                <span className="option-label mb-0">Kích thước</span>
                            </div>
                            <div className="size-option-container">
                                {productData.listSizes.map((size) => {
                                    // Kiểm tra xem size này có tồn tại với màu đã chọn không (nếu đã chọn màu)
                                    // Logic nâng cao: disable size nếu variant tương ứng hết hàng
                                    let isAvailable = true;
                                    if (selectedColorId) {
                                        const variantCheck = productData.listVariants.find(v => v.idColor === selectedColorId && v.idSize === size.id);
                                        if (!variantCheck || variantCheck.quantity <= 0) isAvailable = false;
                                    }

                                    return (
                                        <div
                                            key={size.id}
                                            className={`btn-size-custom ${selectedSizeId === size.id ? 'selected' : ''} ${!isAvailable && selectedColorId ? 'disabled' : ''}`}
                                            onClick={() => isAvailable && setSelectedSizeId(size.id)}
                                        >
                                            {size.name}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 5. Số lượng */}
                        <div className="info-block">
                            <span className="option-label">Số lượng</span>
                            <div className="d-flex align-items-center gap-3">
                                <InputNumber
                                    min={1}
                                    max={maxQuantity > 0 ? maxQuantity : 100} // Nếu chưa chọn variant thì cho nhập, nhưng check lúc add to cart
                                    value={quantity}
                                    onChange={setQuantity}
                                    size="large"
                                    style={{ width: "100px", borderRadius: "4px" }}
                                />
                                {isVariantSelected && (
                                    <span className="text-muted text-sm">
                                        {maxQuantity > 0 ? `${maxQuantity} sản phẩm có sẵn` : <Tag color="red">Hết hàng</Tag>}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* 6. Nút Mua */}
                        <div className="info-block" style={{ marginTop: '20px' }}>
                            <Button
                                type="primary"
                                className="btn-add-cart"
                                icon={<FontAwesomeIcon icon={faTruckFast} />}
                                onClick={handleAddToCart}
                                disabled={isVariantSelected && maxQuantity <= 0}
                                style={{ width: '100%', maxWidth: '400px' }} // Giới hạn chiều dài nút cho đẹp
                            >
                                THÊM VÀO GIỎ HÀNG
                            </Button>
                        </div>
                        <div className="info-block border-top pt-4 mt-4" style={{ maxWidth: '500px' }}>
                            <br></br>
                            <Row gutter={[16, 16]}>
                                <Col span={12}><div className="d-flex align-items-center gap-2 font-size-sm"><FontAwesomeIcon icon={faShieldHeart} className="text-primary" /> Chính hãng 100%</div></Col>
                                <Col span={12}><div className="d-flex align-items-center gap-2 font-size-sm"><FontAwesomeIcon icon={faRetweet} className="text-primary" /> Đổi trả 2 ngày</div></Col>
                                <Col span={12}><div className="d-flex align-items-center gap-2 font-size-sm"><FontAwesomeIcon icon={faFileInvoiceDollar} className="text-primary" /> Thanh toán tiện lợi</div></Col>
                                <Col span={12}><div className="d-flex align-items-center gap-2 font-size-sm"><FontAwesomeIcon icon={faTruckFast} className="text-primary" /> Giao hàng toàn quốc</div></Col>
                            </Row>
                        </div>

                    </div>
                </Col>
            </Row>
            <div>
                <br></br>
                <br></br>
                <br></br>
            </div>
            <div className="mt-5 pt-4 border-top ">
                <div className="d-flex justify-content-center mb-4">
                    <div className={`mx-3 pb-2 fw-bold text-uppercase cursor-pointer 'border-bottom border-dark border-2' : 'text-muted'}`}>Thông tin chi tiết</div>
                </div>
                <div className="bg-light p-4 rounded">
                    <Row>
                        <Col span={12}>
                            <p><b>Chất liệu:</b> {productData.nameMaterial}</p>
                            <p><b>Đế giày:</b> {productData.nameSole}</p>
                        </Col>
                        <Col span={12}>
                            <p><b>Danh mục:</b> {productData.nameCategory}</p>
                            <p><b>Xuất xứ:</b> Việt Nam</p>
                        </Col>
                    </Row>
                </div>

            </div>
        </div>
    );
}

export default ProductDetailCustomer;