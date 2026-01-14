/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  faCarRear,
  faCoins,
  faLocationDot,
  faTags,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Button, Col, message, Modal, Radio, Row } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { parseInt } from "lodash";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import SockJS from "sockjs-client";
import Stomp from "stompjs";
import logoVnPay from "../../../../src/image/logo_vnpay.png";
import { AddressApi } from "./../../../api/admin/address/addressApi";
import { BillApi } from "./../../../api/admin/bill/billApi";
import { CartApi } from "./../../../api/customer/card/CardApi";
import { PaymentApi } from "../../../api/customer/payment/PaymentApi";
import { useCart } from "../cart/CartService";
import ModalCreateAddress from "../../custonmer/payment/modal/ModalCreateAddress";
import ModalUpdateAddress from "../../custonmer/payment/modal/ModalUpdateAddress";
import ModalCreateAddressAccount from "./modal/ModalCreateAddressAccount";
import "./style-payment-account.css";

dayjs.extend(utc);

function PaymentAccount() {
  const nav = useNavigate();
  const { updateTotalQuantity } = useCart();
  const idAccount = sessionStorage.getItem("idAccount");

  // State
  const [modalAddressAccount, setModalAddressAccount] = useState(false);
  const [addressDefault, setAddressDefault] = useState({});
  const [formBill, setFormBill] = useState({
    address: "",
    billDetail: [],
    itemDiscount: 0,
    paymentMethod: "paymentReceive",
    phoneNumber: "",
    totalMoney: 0,
    userName: "",
    afterPrice: 0,
    moneyShip: 0,
  });

  const [moneyShip, setMoneyShip] = useState(0);
  const [dayShip, setDayShip] = useState("");
  const [keyMethodPayment, setKeyMethodPayment] = useState("paymentReceive");

  const listproductOfBill = JSON.parse(sessionStorage.getItem("bill")) || [];
  const [totalAfter, setTotalAfter] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalBefore, setTotalBefore] = useState(0);
  const [userId, setUserId] = useState("");

  const socket = new SockJS("http://localhost:8080/ws");
  const stompClient = Stomp.over(socket);

  // Effect tính tổng tiền hàng
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

  // Effect cập nhật tổng tiền cuối cùng
  useEffect(() => {
    const finalTotal = totalBefore + moneyShip;
    setTotalAfter(finalTotal);
    setFormBill((prev) => ({
      ...prev,
      totalMoney: totalBefore,
      afterPrice: finalTotal,
      moneyShip: moneyShip,
    }));
  }, [totalBefore, moneyShip]);

  // Effect khi địa chỉ thay đổi -> Tính Ship & Ngày giao
  useEffect(() => {
    if (addressDefault && addressDefault.id) {
      // Gọi hàm tính toán GHN (Gộp cả phí ship và ngày giao)
      calculateGhnInfo(addressDefault.districtId, addressDefault.wardCode);

      const updatedListproductOfBill = listproductOfBill.map((item) => {
        const { nameProduct, nameSize, image, ...rest } = item;
        return rest;
      });

      setFormBill((prevFormBill) => ({
        ...prevFormBill,
        address: [
          addressDefault.line,
          addressDefault.ward,
          addressDefault.district,
          addressDefault.province
        ].filter(Boolean).join(", "),
        phoneNumber: addressDefault.phoneNumber,
        userName: addressDefault.fullName,
        billDetail: updatedListproductOfBill,
        idAccount: idAccount,
        paymentMethod: keyMethodPayment,
      }));

      setUserId(addressDefault.userId);
    }
  }, [addressDefault, keyMethodPayment]);

  useEffect(() => {
    if (idAccount) {
      getAddressDefault(idAccount);
    }
  }, [idAccount]);

  const getAddressDefault = (id) => {
    AddressApi.getAddressByUserIdAccountAndStatus(id).then(
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

  // --- HÀM TÍNH PHÍ VÀ NGÀY GIAO (LOGIC MỚI) ---
  const calculateGhnInfo = async (to_district_id, to_ward_code) => {
    setMoneyShip(0);
    setDayShip("");

    if (!to_district_id || !to_ward_code) return;

    // Free ship đơn to
    if (totalBefore >= 2000000) {
      setMoneyShip(0);
      // Vẫn cần chạy tiếp để lấy ngày giao hàng (nếu muốn)
      // Nhưng nếu logic là free ship thì thôi return luôn cũng được
      // return; 
    }

    try {
      const SHOP_ID = 5593709;
      const FROM_DISTRICT = 3440;

      // BƯỚC 1: Lấy service_id phù hợp (Tránh lỗi Route Not Found)
      const resService = await AddressApi.getAvailableServices(
        SHOP_ID,
        FROM_DISTRICT,
        to_district_id
      );

      if (!resService.data.data || resService.data.data.length === 0) {
        message.error("GHN chưa hỗ trợ giao hàng tuyến đường này");
        return;
      }

      const activeService = resService.data.data[0];
      const serviceId = activeService.service_id;

      // BƯỚC 2: Tính phí ship
      // Chỉ tính tiền nếu đơn < 2 triệu
      if (totalBefore < 2000000) {
        const resFee = await AddressApi.calculateFee(
          SHOP_ID,
          serviceId,
          totalBefore,
          to_district_id,
          to_ward_code
        );
        if (resFee.data && resFee.data.data) {
          setMoneyShip(resFee.data.data.total);
        }
      }

      // BƯỚC 3: Tính ngày giao hàng (Dùng đúng serviceId vừa tìm được)
      const resTime = await AddressApi.getDayShip(to_district_id, to_ward_code, serviceId);
      if (resTime.data && resTime.data.data) {
        const leadtimeInSeconds = resTime.data.data.leadtime;
        const formattedDate = moment.unix(leadtimeInSeconds).format("DD/MM/YYYY");
        setDayShip(formattedDate);
      }

    } catch (error) {
      console.error("Lỗi GHN:", error);
      const msg = error.response?.data?.message || "Lỗi vận chuyển";
      if (msg.includes("route not found")) {
        message.error("Tuyến đường không hỗ trợ (Route not found)");
      } else {
        // Ẩn bớt lỗi vặt
      }
    }
  };

  // --- PHẦN THANH TOÁN ---
  const payment = () => {
    Modal.confirm({
      title: "Xác nhận đặt hàng",
      content: "Bạn có chắc chắn muốn đặt hàng ?",
      okText: "Đặt hàng",
      okType: "primary",
      cancelText: "Hủy",
      onOk() {
        if (!addressDefault || !addressDefault.id) {
          message.error("Bạn chưa có địa chỉ nhận hàng!");
          return;
        }

        const dataBillSave = {
          ...formBill,
          itemDiscount: 0,
          shippingTime: dayShip
            ? moment(dayShip, "DD/MM/YYYY").toDate().getTime()
            : null,
          poin: 0,
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
          BillApi.createBillAccountOnline(dataBillSave).then(
            (res) => {
              CartApi.quantityInCart(idAccount).then((resCart) => {
                updateTotalQuantity(resCart.data.data);
                stompClient.send("/action/notifyAdmin", {}, "Có đơn hàng mới");
              });
              message.success("Đặt hàng thành công.");
              nav("/home");
            },
            (err) => {
              console.error(err);
              message.error("Lỗi khi đặt hàng!");
            }
          );
        }
      },
    });
  };

  const formatMoney = (price) => {
    return (
      parseInt(price || 0)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND"
    );
  };

  const paymentReceive = () => setKeyMethodPayment("paymentReceive");
  const paymentVnpay = () => setKeyMethodPayment("paymentVnpay");

  // --- STATE MODAL ---
  const [isModalAddressOpen, setIsModalAddressOpen] = useState(false);
  const [modalVisibleAddAddress, setModalVisibleAddAddress] = useState(false);
  const [modalVisibleUpdateAddress, setModalVisibleUpdateAddress] = useState(false);
  const [addressId, setAddressId] = useState("");
  const [listAddress, setListAddress] = useState([]);

  const changeRadio = (item) => setAddressDefault(item);

  const handleChangeAddress = () => {
    setIsModalAddressOpen(true);
    AddressApi.getAllAddressByAccount(idAccount).then((res) => {
      console.log("idAccount: ", idAccount)
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
          {/* CỘT TRÁI: THÔNG TIN */}
          <Col lg={16} md={24} sm={24}>
            <div className="payment-card">
              <div className="payment-card-title">
                <FontAwesomeIcon icon={faLocationDot} style={{ marginRight: 10, color: "#ff4400" }} />
                ĐỊA CHỈ NHẬN HÀNG
              </div>
              {addressDefault && Object.keys(addressDefault).length > 0 ? (
                <div className="address-box">
                  <span className="change-btn" onClick={handleChangeAddress}>Thay đổi</span>
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ fontSize: "16px", fontWeight: "700", color: "#262626" }}>
                      {addressDefault.fullName || "Chưa có tên"}
                    </span>
                    <span style={{ margin: "0 10px", color: "#bfbfbf" }}>|</span>
                    <span style={{ color: "#595959" }}>{addressDefault.phoneNumber}</span>
                  </div>
                  <div style={{ color: "#595959" }}>
                    {[addressDefault.line, addressDefault.ward, addressDefault.district, addressDefault.province].filter(Boolean).join(", ")}
                  </div>
                </div>
              ) : (
                <div className="address-empty" onClick={() => setModalAddressAccount(true)}>
                  <Button type="dashed" block icon={<FontAwesomeIcon icon={faLocationDot} />}>
                    Thêm địa chỉ giao hàng
                  </Button>
                </div>
              )}
            </div>

            {/* DANH SÁCH SẢN PHẨM */}
            <div className="payment-card">
              <div className="payment-card-title">
                <FontAwesomeIcon icon={faCarRear} style={{ marginRight: 10, color: "#ff4400" }} />
                SẢN PHẨM
              </div>
              <div className="product-list-container">
                {listproductOfBill.map((item, index) => (
                  <div className="product-item-new" key={index}>
                    <Badge count={item.quantity} color="#ff4400">
                      <img src={item.image?.split(",")[0]} className="product-img" alt="" />
                    </Badge>
                    <div style={{ flex: 1, marginLeft: 20 }}>
                      <h4 style={{ margin: "0 0 5px" }}>{item.nameProduct}</h4>
                      <p style={{ color: "#8c8c8c", fontSize: "13px" }}>{item.nameSize} - {item.nameColor}</p>
                    </div>
                    <div style={{ fontWeight: "700" }}>{formatMoney(item.price)}</div>
                  </div>
                ))}
              </div>
              <div className="delivery-info-bar">
                <span>Thời gian nhận dự kiến: <strong>{dayShip || "..."}</strong></span>
              </div>
            </div>

            {/* THANH TOÁN */}
            <div className="payment-card">
              <div className="payment-card-title">
                <FontAwesomeIcon icon={faCoins} style={{ marginRight: 10, color: "#ff4400" }} />
                PHƯƠNG THỨC THANH TOÁN
              </div>
              <div className="payment-methods-grid">
                <div className={`method-item ${keyMethodPayment === "paymentReceive" ? "active" : ""}`} onClick={paymentReceive}>
                  <img src="https://hstatic.net/0/0/global/design/seller/image/payment/cod.svg?v=6" width={40} alt="COD" />
                  <p className="method-name">COD</p>
                </div>
                {/* <div className={`method-item`}>
                  <img src={logoVnPay} width={40} alt="VNPay" />
                  <p className="method-name">Ví VNPay</p>
                </div> */}
              </div>
            </div>
          </Col>

          {/* CỘT PHẢI: TỔNG TIỀN */}
          <Col lg={8} md={24} sm={24}>
            <div className="payment-sidebar-card">
              <div className="payment-card-title" style={{ border: "none", padding: 0 }}>
                <FontAwesomeIcon icon={faTags} style={{ marginRight: 10, color: "#ff4400" }} />
                CHI TIẾT THANH TOÁN
              </div>
              <div className="summary-section">
                <div className="summary-row">
                  <span>Tạm tính</span>
                  <span>{formatMoney(totalBefore)}</span>
                </div>
                <div className="summary-row">
                  <span>Phí vận chuyển</span>
                  <span>{formatMoney(moneyShip)}</span>
                </div>
              </div>
              <div className="total-divider"></div>
              <div className="total-final-row">
                <span>Tổng cộng</span>
                <div className="total-amount-large">{formatMoney(totalAfter)}</div>
              </div>
              <button className="btn-order-now" onClick={payment}>ĐẶT HÀNG</button>
            </div>
          </Col>
        </Row>
      </div>

      {/* CÁC MODAL */}
      <ModalCreateAddressAccount modalAddressAccount={modalAddressAccount} setModalAddressAccount={setModalAddressAccount} getAddressDefault={getAddressDefault} />
      <ModalUpdateAddress visible={modalVisibleUpdateAddress} onCancel={handleCancel} id={addressId} />
      <ModalCreateAddress visible={modalVisibleAddAddress} onCancel={handleCancel} id={userId} />

      <Modal
        title={<strong>Chọn địa chỉ</strong>}
        open={isModalAddressOpen}
        onOk={() => setIsModalAddressOpen(false)}
        onCancel={() => setIsModalAddressOpen(false)}
        width={600}
        footer={[<Button key="back" onClick={() => setIsModalAddressOpen(false)}>Đóng</Button>]}
      >
        <Button type="dashed" block onClick={() => { setIsModalAddressOpen(false); setModalVisibleAddAddress(true); }} style={{ marginBottom: 20 }}>+ Thêm địa chỉ mới</Button>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {listAddress.map((item) => (
            <div className="address-item-select" key={item.id} onClick={() => changeRadio(item)} style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #f0f0f0' }}>
              <Row align="middle">
                <Col span={2}><Radio checked={item.id === addressDefault?.id} /></Col>
                <Col span={18}>
                  <div style={{ fontWeight: "600" }}>{item.fullName} | {item.phoneNumber}</div>
                  <div style={{ fontSize: "13px" }}>{item.line}, {item.ward}, {item.district}, {item.province}</div>
                </Col>
                <Col span={4} style={{ textAlign: "right" }}>
                  <Button type="link" onClick={(e) => { e.stopPropagation(); setAddressId(item.id); setModalVisibleUpdateAddress(true); setIsModalAddressOpen(false); }}>Sửa</Button>
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