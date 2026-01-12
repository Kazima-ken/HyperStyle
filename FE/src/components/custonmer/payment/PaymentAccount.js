/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  faCarRear,
  faCoins,
  faLocationDot,
  faTags,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Button, Checkbox, Col, Modal, Radio, Row } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import utc from "dayjs/plugin/utc";
import { parseInt } from "lodash";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logoVnPay from "../../../../src/image/logo_vnpay.png";
import { CartApi } from "./../../../api/customer/card/CardApi";
import { PaymentApi } from "../../../api/customer/payment/PaymentApi";
import ModalCreateAddress from "../../custonmer/payment/modal/ModalCreateAddress";
import ModalUpdateAddress from "../../custonmer/payment/modal/ModalUpdateAddress";
import { useCart } from "../cart/CartService";
import { AddressApi } from "./../../../api/admin/address/addressApi";
import { BillApi } from "./../../../api/admin/bill/billApi";
import ModalCreateAddressAccount from "./modal/ModalCreateAddressAccount";
import "./style-payment-account.css";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

dayjs.extend(utc);

function PaymentAccount() {
  const nav = useNavigate();
  const { updateTotalQuantity } = useCart();
  const idAccount = sessionStorage.getItem("idAccount");

  // State quản lý địa chỉ và form
  const [modalAddressAccount, setModalAddressAccount] = useState(false);
  const [addressDefault, setAddressDefault] = useState({});
  const [formBill, setFormBill] = useState({
    address: "",
    billDetail: [],
    itemDiscount: 0, // Luôn là 0 vì bỏ voucher
    paymentMethod: "paymentReceive",
    phoneNumber: "",
    totalMoney: 0,
    userName: "",
    idVoucher: null, // Bỏ voucher
    afterPrice: 0,
    moneyShip: 0,
  });

  const [moneyShip, setMoneyShip] = useState(0);
  const [dayShip, setDayShip] = useState("");
  const [keyMethodPayment, setKeyMethodPayment] = useState("paymentReceive");

  // Lấy dữ liệu sản phẩm từ Session (do Cart chuyển sang)
  const listproductOfBill = JSON.parse(sessionStorage.getItem("bill")) || [];

  const [totalAfter, setTotalAfter] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalBefore, setTotalBefore] = useState(0);
  const [userId, setUserId] = useState("");

  // Socket (giữ nguyên để thông báo admin)
  const socket = new SockJS("http://localhost:8080/ws");
  const stompClient = Stomp.over(socket);

  useEffect(() => {
    if (listproductOfBill) {
      const totalMoney = listproductOfBill.reduce(
        (acc, item) => acc + (parseInt(item.price) * parseInt(item.quantity)),
        0
      );
      const totalQty = listproductOfBill.reduce(
        (acc, item) => acc + parseInt(item.quantity),
        0
      );

      setTotalBefore(totalMoney);
      setTotalQuantity(totalQty);
    }
  }, []);

  // 2. Tính tổng thanh toán (Total After) = Tiền hàng + Ship
  useEffect(() => {
    const finalTotal = totalBefore + moneyShip;
    setTotalAfter(finalTotal);

    // Cập nhật vào formBill để gửi đi
    setFormBill(prev => ({
      ...prev,
      totalMoney: totalBefore,
      afterPrice: finalTotal,
      moneyShip: moneyShip
    }));
  }, [totalBefore, moneyShip]);


  // --- PHẦN 2: XỬ LÝ ĐỊA CHỈ & SHIP ---

  useEffect(() => {
    if (idAccount) {
      getAddressDefault(idAccount);
    }
  }, [idAccount]);

  useEffect(() => {
    if (addressDefault && addressDefault.id) {
      getMoneyShip(addressDefault.districtId, addressDefault.wardCode);
      getDayShip(addressDefault.districtId, addressDefault.wardCode);

      const updatedListproductOfBill = listproductOfBill.map((item) => {
        const { nameProduct, nameSize, image, ...rest } = item;
        return rest;
      });

      setFormBill((prevFormBill) => ({
        ...prevFormBill,
        address:
          addressDefault.line +
          ", " +
          addressDefault.ward +
          ", " +
          addressDefault.district +
          ", " +
          addressDefault.province,
        phoneNumber: addressDefault.phoneNumber,
        userName: addressDefault.fullName,
        billDetail: updatedListproductOfBill,
        idAccount: idAccount,
        paymentMethod: keyMethodPayment,
      }));

      setUserId(addressDefault.userId);
    }
  }, [addressDefault, keyMethodPayment]);

  const getAddressDefault = (id) => {
    AddressApi.getAddressByUserIdAndStatus(id).then(
      (res) => {
        if (res.data && res.data.data) {
          setAddressDefault(res.data.data);
        } else {
          setAddressDefault(null);
        }
      },
      (err) => {
        console.log(err);
        setAddressDefault(null);
      }
    );
  };

  const getMoneyShip = (districtId, wardCode) => {
    // Nếu đơn hàng > 2 triệu thì free ship (giữ logic cũ của bạn hoặc bỏ tùy ý)
    if (totalBefore >= 2000000) {
      setMoneyShip(0);
    } else {
      AddressApi.getMoneyShip(districtId, wardCode).then(
        (res) => setMoneyShip(res.data.data.total),
        (err) => console.log(err)
      );
    }
  };

  const getDayShip = (districtId, wardCode) => {
    AddressApi.getDayShip(districtId, wardCode).then(
      (res) => {
        const leadtimeInSeconds = res.data.data.leadtime;
        const formattedDate = moment.unix(leadtimeInSeconds).format("DD/MM/YYYY");
        setDayShip(formattedDate);
      },
      (err) => console.log(err)
    );
  };

  // --- PHẦN 3: XỬ LÝ THANH TOÁN ---

  const payment = () => {
    Modal.confirm({
      title: "Xác nhận đặt hàng",
      content: "Bạn có chắc chắn muốn đặt hàng ?",
      okText: "Đặt hàng",
      okType: "primary",
      cancelText: "Hủy",
      onOk() {
        if (!addressDefault || !addressDefault.id) {
          toast.error("Bạn chưa có địa chỉ nhận hàng, vui lòng thêm!");
          return;
        }

        const dataBillSave = {
          ...formBill,
          itemDiscount: 0, // Không có giảm giá
          shippingTime: dayShip,
          poin: 0, // Reset point nếu không dùng logic point
        };

        if (formBill.paymentMethod === "paymentVnpay") {
          const data = {
            vnp_Ammount: totalAfter,
            billDetail: formBill.billDetail,
          };
          PaymentApi.paymentVnpay(data).then(
            (res) => {
              window.location.replace(res.data.data);
              sessionStorage.setItem("formBill", JSON.stringify(dataBillSave));
            },
            (err) => console.error(err)
          );
        } else {
          // Thanh toán khi nhận hàng (COD)
          BillApi.createBillAccountOnline(dataBillSave).then(
            (res) => {
              CartApi.quantityInCart(idAccount).then((resCart) => {
                updateTotalQuantity(resCart.data.data);
                stompClient.send("/action/notifyAdmin", {}, "Có đơn hàng mới");
              });
              toast.success("Đặt hàng thành công.");
              nav("/home");
            },
            (err) => {
              console.error(err);
              toast.error("Lỗi khi đặt hàng!");
            }
          );
        }
      },
    });
  };

  // --- PHẦN 4: HỖ TRỢ GIAO DIỆN ---

  const formatMoney = (price) => {
    return (
      parseInt(price || 0)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND"
    );
  };

  const paymentReceive = () => {
    setKeyMethodPayment("paymentReceive");
  };

  const paymentVnpay = () => {
    setKeyMethodPayment("paymentVnpay");
  };

  const [isModalAddressOpen, setIsModalAddressOpen] = useState(false);
  const [modalVisibleAddAddress, setModalVisibleAddAddress] = useState(false);
  const [modalVisibleUpdateAddress, setModalVisibleUpdateAddress] = useState(false);
  const [addressId, setAddressId] = useState("");
  const [listAddress, setListAddress] = useState([]);

  const changeRadio = (item) => {
    setAddressDefault(item);
  };

  const handleChangeAddress = () => {
    setIsModalAddressOpen(true);
    AddressApi.fetchAllAddressByUser(userId).then((res) => {
      setListAddress(res.data.data);
    });
  };

  const handleCancel = () => {
    setModalVisibleAddAddress(false);
    setModalVisibleUpdateAddress(false);
    getAddressDefault(idAccount);
  };

  return (
    <div className="payment-acc-container">
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        <Row gutter={24}>
          <Col lg={16} md={24} sm={24}>

            <div className="payment-card">
              <div className="payment-card-title">
                <FontAwesomeIcon icon={faLocationDot} style={{ marginRight: 10, color: "#ff4400" }} />
                ĐỊA CHỈ NHẬN HÀNG
              </div>

              {addressDefault && Object.keys(addressDefault).length > 0 ? (
                <div className="address-box">
                  <span className="change-btn" onClick={handleChangeAddress}>
                    Thay đổi
                  </span>
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ fontSize: "16px", fontWeight: "700", color: "#262626" }}>
                      {addressDefault.fullName || "Chưa có tên"}
                    </span>
                    <span style={{ margin: "0 10px", color: "#bfbfbf" }}>|</span>
                    <span style={{ color: "#595959" }}>{addressDefault.phoneNumber || "Chưa có SĐT"}</span>
                  </div>
                  <div style={{ color: "#595959", lineHeight: "1.6" }}>
                    <p style={{ margin: 0 }}>
                      {[
                        addressDefault.line,
                        addressDefault.ward,
                        addressDefault.district,
                        addressDefault.province
                      ].filter(Boolean).join(", ")}
                    </p>
                  </div>
                  {addressDefault.status === "DANG_SU_DUNG" && (
                    <div style={{ marginTop: 12 }}>
                      <Badge
                        count="Mặc định"
                        style={{ backgroundColor: "#fff2e8", color: "#ff4400", border: "1px solid #ffbb96" }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="address-empty" onClick={() => setModalAddressAccount(true)}>
                  <Button type="dashed" block icon={<FontAwesomeIcon icon={faLocationDot} />}>
                    Chưa có địa chỉ. Nhấp để thêm địa chỉ giao hàng mới!
                  </Button>
                </div>
              )}
            </div>

            {/* 2. DANH SÁCH SẢN PHẨM */}
            <div className="payment-card">
              <div className="payment-card-title">
                <FontAwesomeIcon icon={faCarRear} style={{ marginRight: 10, color: "#ff4400" }} />
                SẢN PHẨM ĐÃ CHỌN
              </div>

              <div className="product-list-container">
                {listproductOfBill.map((item, index) => (
                  <div className="product-item-new" key={index}>
                    <Badge count={item.quantity} color="#ff4400" offset={[-5, 5]}>
                      <img
                        src={item.image?.split(",")[0]}
                        className="product-img"
                        alt={item.nameProduct}
                      />
                    </Badge>

                    <div style={{ flex: 1, marginLeft: 20 }}>
                      <h4 style={{ margin: "0 0 5px 0", fontSize: "15px", color: "#262626" }}>
                        {item.nameProduct}
                      </h4>
                      <p style={{ color: "#8c8c8c", fontSize: "13px", margin: 0 }}>
                        Kích cỡ: {item.nameSize} | Màu: {item.nameColor}
                      </p>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontWeight: "700", color: "#262626", margin: 0 }}>
                        {formatMoney(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="delivery-info-bar">
                <span style={{ color: "#595959" }}>
                  Thời gian nhận hàng dự kiến: <strong>{dayShip || "Đang tính toán..."}</strong>
                </span>
              </div>
            </div>

            {/* 3. PHƯƠNG THỨC THANH TOÁN */}
            <div className="payment-card">
              <div className="payment-card-title">
                <FontAwesomeIcon icon={faCoins} style={{ marginRight: 10, color: "#ff4400" }} />
                PHƯƠNG THỨC THANH TOÁN
              </div>

              <div className="payment-methods-grid">
                <div
                  className={`method-item ${keyMethodPayment === "paymentReceive" ? "active" : ""}`}
                  onClick={paymentReceive}
                >
                  <img src="https://hstatic.net/0/0/global/design/seller/image/payment/cod.svg?v=6" width={40} alt="COD" />
                  <p className="method-name">Khi nhận hàng</p>
                  <div className="method-desc">Thanh toán tiền mặt</div>
                </div>

                <div
                  className={`method-item ${keyMethodPayment === "paymentVnpay" ? "active" : ""}`}
                  onClick={paymentVnpay}
                >
                  <img src={logoVnPay} width={40} alt="VNPay" />
                  <p className="method-name">Ví VNPay</p>
                  <div className="method-desc">Cổng thanh toán online</div>
                </div>
              </div>
            </div>
          </Col>

          {/* ==================== CỘT PHẢI: TỔNG KẾT CHI PHÍ ==================== */}
          <Col lg={8} md={24} sm={24}>
            <div className="payment-sidebar-card">
              <div className="payment-card-title" style={{ border: "none", padding: 0 }}>
                <FontAwesomeIcon icon={faTags} style={{ marginRight: 10, color: "#ff4400" }} />
                CHI TIẾT THANH TOÁN
              </div>

              <div className="summary-section">
                <div className="summary-row">
                  <span>Tạm tính ({totalQuantity} sản phẩm)</span>
                  <span>{formatMoney(totalBefore)}</span>
                </div>

                <div className="summary-row">
                  <span>Phí vận chuyển</span>
                  <span>{formatMoney(moneyShip)}</span>
                </div>
              </div>

              <div className="total-divider"></div>

              <div className="total-final-row">
                <span style={{ fontWeight: "600", color: "#262626" }}>Tổng cộng</span>
                <div style={{ textAlign: "right" }}>
                  <div className="total-amount-large">
                    {formatMoney(totalAfter)}
                  </div>
                  <div style={{ fontSize: "12px", color: "#8c8c8c", fontWeight: "normal" }}>
                    (Đã bao gồm VAT)
                  </div>
                </div>
              </div>

              <button className="btn-order-now" onClick={payment}>
                XÁC NHẬN ĐẶT HÀNG
              </button>
            </div>
          </Col>
        </Row>
      </div>

      {/* ==================== CÁC MODAL PHỤ TRỢ ==================== */}

      {/* Modal thêm địa chỉ cho user đã có tài khoản */}
      <ModalCreateAddressAccount
        modalAddressAccount={modalAddressAccount}
        setModalAddressAccount={setModalAddressAccount}
        getAddressDefault={getAddressDefault}
      />

      {/* Modal cập nhật thông tin địa chỉ */}
      <ModalUpdateAddress
        visible={modalVisibleUpdateAddress}
        onCancel={handleCancel}
        id={addressId}
      />

      {/* Modal tạo mới địa chỉ (dùng chung cho luồng khác) */}
      <ModalCreateAddress
        visible={modalVisibleAddAddress}
        onCancel={handleCancel}
        id={userId}
      />

      {/* Modal danh sách địa chỉ để lựa chọn */}
      <Modal
        title={<strong>Chọn địa chỉ nhận hàng</strong>}
        open={isModalAddressOpen}
        onOk={() => setIsModalAddressOpen(false)}
        onCancel={() => setIsModalAddressOpen(false)}
        width={600}
        footer={[
          <Button key="back" onClick={() => setIsModalAddressOpen(false)}>Đóng</Button>,
          <Button key="submit" type="primary" style={{ backgroundColor: "#ff4400", border: "none" }} onClick={() => setIsModalAddressOpen(false)}>
            Xác nhận
          </Button>
        ]}
      >
        <div style={{ marginBottom: 20 }}>
          <Button type="dashed" block onClick={() => { setIsModalAddressOpen(false); setModalVisibleAddAddress(true); }}>
            + Thêm địa chỉ mới
          </Button>
        </div>

        <div className="modal-address-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {listAddress.map((item) => (
            <div
              className="address-item-select"
              key={item.id}
              onClick={() => changeRadio(item)}
              style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #f0f0f0' }}
            >
              <Row align="middle">
                <Col span={2}>
                  <Radio checked={item.id === addressDefault?.id} />
                </Col>
                <Col span={18}>
                  <div style={{ fontWeight: "600" }}>
                    {item.fullName} | {item.phoneNumber}
                  </div>
                  <div style={{ fontSize: "13px", color: "#595959" }}>
                    {item.line}, {item.ward}, {item.district}, {item.province}
                  </div>
                  {item.status === "DANG_SU_DUNG" && (
                    <span className="mini-status-tag" style={{ color: '#ff4400', fontSize: '11px' }}>[Mặc định]</span>
                  )}
                </Col>
                <Col span={4} style={{ textAlign: "right" }}>
                  <Button
                    type="link"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAddressId(item.id);
                      setModalVisibleUpdateAddress(true);
                      setIsModalAddressOpen(false);
                    }}
                  >
                    Sửa
                  </Button>
                </Col>
              </Row>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
export default PaymentAccount;