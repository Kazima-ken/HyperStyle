import "./style-card.css";
import { Link, useNavigate } from "react-router-dom";

import { useCart } from "./CartService";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinus,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Checkbox, Col, Input, message, Modal, Row, Tooltip } from "antd";
import dayjs from "dayjs";
import { CartApi } from "./../../../api/customer/card/CardApi";
import { ProductDetailApi } from "./../../../api/admin/productDetail/productDetailApi";
import { parseInt } from "lodash";

function Cart() {
  const nav = useNavigate();
  const idAccountLocal = sessionStorage.getItem("idAccount");
  const cartLocal = JSON.parse(localStorage.getItem("cartLocal"));

  // State
  const [cart, setCart] = useState([]);
  const [chooseItemCart, setChooseItemCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalBill, setTotalBill] = useState(0);
  const { updateTotalQuantity } = useCart();

  // State cho Modal đổi size
  const [modalSize, setModalSize] = useState(false);
  const [listSize, setListSize] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [clickedIndex, setClickedIndex] = useState(-1);

  // --- PHẦN 1: LOGIC KHỞI TẠO DỮ LIỆU ---

  useEffect(() => {
    if (!idAccountLocal) {
      message.info("Vui lòng đăng nhập để xem giỏ hàng!");
      nav("/login");
      return;
    }
    getListCart(idAccountLocal);
  }, [idAccountLocal]);

  useEffect(() => {
    if (idAccountLocal === null && cartLocal) {
      // Logic load cart từ Local Storage (Guest)
      const requests = cartLocal.map((item) =>
        ProductDetailApi.getOne(item.idProductDetail).then((res) => {
          const data = res.data.data;
          return {
            codeColor: item.codeColor,
            idProductDetail: item.idProductDetail,
            image: item.image,
            nameProduct: item.nameProduct,
            nameSize: item.nameSize,
            price: data.price, // Lấy giá mới nhất từ DB
            quantity: item.quantity,
            quantityProductDetail: data.quantity,
            nameColor: item.nameColor,
          };
        })
      );

      Promise.all(requests).then((results) => {
        setCart(results);
      });
    } else if (idAccountLocal) {
      getListCart(idAccountLocal);
    }
  }, []);

  useEffect(() => {
    if (idAccountLocal === null) {
      localStorage.setItem("cartLocal", JSON.stringify(cart));
      const total = cart.reduce((acc, item) => acc + item.quantity, 0);
      updateTotalQuantity(total);
    } else {
      getQuantityInCart(idAccountLocal);
    }
  }, [cart]);

  useEffect(() => {
    if (cart.length > 0 && chooseItemCart.length === cart.length) {
      setSelectAllChecked(true);
    } else {
      setSelectAllChecked(false);
    }
  }, [chooseItemCart, cart]);

  useEffect(() => {
    if (chooseItemCart.length > 0) {
      const updatedChooseList = chooseItemCart.map(selectedItem => {
        const latestItemInCart = cart.find(c => c.idProductDetail === selectedItem.idProductDetail);
        return latestItemInCart ? latestItemInCart : selectedItem;
      });
      if (JSON.stringify(updatedChooseList) !== JSON.stringify(chooseItemCart)) {
        setChooseItemCart(updatedChooseList);
      }
    }
  }, [cart]);

  useEffect(() => {
    const total = chooseItemCart.reduce((acc, item) => {
      const price = parseInt(item.price || 0);
      const quantity = item.quantity;
      return acc + (price * quantity);
    }, 0);

    setTotalPrice(total);
    setTotalBill(total);
  }, [chooseItemCart]);


  const getQuantityInCart = (id) => {
    CartApi.quantityInCart(id).then(
      (res) => {
        updateTotalQuantity(res.data.data);
      },
      (err) => console.log(err)
    );
  };

  const getListCart = (id) => {
    CartApi.listCart(id).then(
      (res) => {
        setCart(res.data.data);
      },
      (err) => console.log(err)
    );
  };

  const formatMoney = (price) => {
    if (!price && price !== 0) return "0 VND";
    return (
      parseInt(price)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND"
    );
  };

  const handleSelectAllChange = () => {
    if (selectAllChecked) {
      setChooseItemCart([]);
    } else {
      const itemOutNumber = cart.find(
        (item) => item.quantityProductDetail === 0
      );
      if (itemOutNumber) {
        message.warning("Có sản phẩm đã bán hết, vui lòng xoá!");
        return;
      }
      setChooseItemCart(cart);
    }
    setSelectAllChecked(!selectAllChecked);
  };

  const chooseCartForBill = (item, checked) => {
    if (item.quantityProductDetail === 0) {
      message.error("Sản phẩm đã bán hết");
      return;
    }

    if (checked) {
      setChooseItemCart([...chooseItemCart, item]);
    } else {
      setChooseItemCart(
        chooseItemCart.filter(
          (i) => i.idProductDetail !== item.idProductDetail
        )
      );
    }
  };

  const deleteItemCart = (record) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa sản phẩm này?",
      onOk() {
        if (idAccountLocal) {
          CartApi.deleteCartDetail(record.idCart)
            .then(() => {
              message.success("Xóa thành công");
              setCart(prev => prev.filter(item => item.idCart !== record.idCart));
              setChooseItemCart(prev => prev.filter(item => item.idCart !== record.idCart));
              getQuantityInCart(idAccountLocal);
            })
            .catch((err) => message.error("Lỗi khi xóa!"));
        } else {
          const newCart = cart.filter(item => item.idProductDetail !== record.idProductDetail);
          setCart(newCart);
          setChooseItemCart(prev => prev.filter(item => item.idProductDetail !== record.idProductDetail));
          message.success("Xóa thành công");
        }
      },
    });
  };

  const deleteAllCart = async () => {
    try {
      if (idAccountLocal) {
        await CartApi.deleteAllCartDetail(idAccountLocal);
      }
      setCart([]);
      setChooseItemCart([]);
      updateTotalQuantity(0);
      message.success("Đã xóa sạch giỏ hàng");
    } catch (err) {
      console.error(err);
    }
  };

  const payment = () => {
    if (chooseItemCart.length === 0) {
      message.warning("Quý khách chưa chọn sản phẩm để thanh toán!", { autoClose: 2000 });
      return;
    }

    if (totalBill > 100000000) {
      message.warning("Đơn hàng quá lớn (>100tr), vui lòng liên hệ cửa hàng!");
      return;
    }

    sessionStorage.setItem("bill", JSON.stringify(chooseItemCart));
    if (idAccountLocal === null) {
      window.location.href = "/payment";
    } else {
      window.location.href = "/payment-acc";
    }
  };



  return (
    <div className="cart">
      <div className="content-cart">
        <div className="title-cart">
          <p className="cart-text">Giỏ Hàng</p>
        </div>

        <Row>
          <Col lg={{ span: 16, offset: 4 }}>
            <div className="form-content-cart">
              <div className="info-cart">
                <div className="cart-item">
                  <div className="box-title-cart">
                    <div style={{ width: "30%", fontWeight: "bold", color: "gray", fontSize: "15px", display: "flex" }}>
                      <Checkbox
                        className="custom-checkbox-all"
                        onChange={handleSelectAllChange}
                        checked={selectAllChecked}
                      />
                    </div>
                    <div style={{ width: "45%", fontWeight: "bold", color: "gray", fontSize: "15px" }}>
                      Sản phẩm
                    </div>
                    <div style={{ width: "25%", fontWeight: "bold", color: "gray", fontSize: "15px", textAlign: "center" }}>
                      Tổng cộng
                    </div>
                  </div>

                  <div>
                    {cart.length === 0 ? (
                      <Tooltip title="Bấm để mua hàng">
                        <Link className="cart-is-empty" to={"/home"}></Link>
                      </Tooltip>
                    ) : (
                      <>
                        {cart.map((item, index) => (
                          <div
                            className={`item-cart ${index === cart.length - 1 ? "last-item" : ""}`}
                            key={index}
                          >
                            <div className="box-cart-img">
                              <Checkbox
                                className="custom-checkbox"
                                onChange={(e) => chooseCartForBill(item, e.target.checked)}
                                checked={chooseItemCart.some(
                                  (cartItem) => cartItem.idProductDetail === item.idProductDetail
                                )}
                              />
                            </div>
                            <div className="info-product-detail">
                              <div className="cart-name">
                                {item.nameProduct} - size: {item.nameSize} - màu sắc: {item.codeColor}
                              </div>
                              <div className="cart-price">
                                Giá: {formatMoney(item.price)}
                              </div>

                              <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
                                <div>
                                  <div className="form-change-quantity">
                                    <div style={{ fontWeight: "bold", marginRight: 10 }}>
                                      Số lượng:
                                    </div>
                                    <Input
                                      className="quantity-product-in-cart"
                                      min={1}
                                      max={item.quantityProductDetail}
                                      value={item.quantity}
                                      disabled
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="form-status-cart">
                              <div style={{ fontSize: "17px", fontWeight: "500", textAlign: "center", marginBottom: "10%", width: "150px", color: "#ff4400" }}>
                                {item.quantityProductDetail > 0 ? "Còn hàng" : "Hết hàng"}
                              </div>

                              <div style={{ fontSize: "17px", fontWeight: "500", textAlign: "center", marginTop: "5%", width: "150px" }}>
                                {formatMoney(item.quantity * (item.price || 0))}
                              </div>

                              <div className="button-delete-cart">
                                <Tooltip title="Xóa sản phẩm">
                                  <FontAwesomeIcon
                                    icon={faTrash}
                                    size="xl"
                                    onClick={() => deleteItemCart(item)}
                                  />
                                </Tooltip>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
                {cart.length !== 0 && (
                  <div style={{ display: "flex", marginTop: 20 }}>
                    <div className="button-delete-all-cart" style={{ borderRadius: "7px" }} onClick={deleteAllCart}>
                      XOÁ TẤT CẢ
                    </div>
                  </div>
                )}
              </div>

              {/* BILL OF CART */}
              <div className="bill-of-cart" style={{ borderRadius: "20px" }}>
                <div className="content-bill-of-cart">
                  <div className="text-bill-in-cart"> ĐƠN HÀNG</div>

                  {/* HIỂN THỊ TỔNG TIỀN CUỐI CÙNG */}
                  <div style={{ padding: "20px" }}>
                    <h3>Tổng tiền : {formatMoney(totalBill)}</h3>
                  </div>

                  <div className="button-pay" onClick={payment} style={{ borderRadius: "10px" }}>
                    TIẾP TỤC THANH TOÁN
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>

    </div>
  );
}

export default Cart;