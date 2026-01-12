import { CloseOutlined } from "@ant-design/icons";
import { faCarRear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Form, Input, Modal, Row, Select } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import utc from "dayjs/plugin/utc";
import { useEffect, useState } from "react";
import logoVnPay from "../../../../src/image/logo_vnpay.png";
import { PaymentApi } from "../../../api/customer/payment/PaymentApi";
import AddressApi from "./../../../api/admin/address/addressApi";
import { BillApi } from "./../../../api/admin/bill/billApi";
import "./style-payment.css";
import { useCart } from "../cart/CartService";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { parseInt } from "lodash";
import { red } from "@ant-design/colors";
dayjs.extend(utc);
function Payment() {
  const { updateTotalQuantity } = useCart();
  const { Option } = Select;
  const idAccount = sessionStorage.getItem("idAccount");
  const [listCity, setListCity] = useState([]);
  const [listDistrict, setListDistrict] = useState([]);
  const [listWard, setListWard] = useState([]);
  const navigate = useNavigate();
  const listproductOfBill = JSON.parse(sessionStorage.getItem("bill"));
  const voucher = JSON.parse(sessionStorage.getItem("voucher"));

  const totalMoney = listproductOfBill.reduce(
    (total, item) => total + parseInt(item.price) * item.quantity,
    0
  );
  const [formBill, setFormBill] = useState({
    address: "",
    billDetail: [],
    district: "",
    districtId: "",
    email: "",
    itemDiscount: 0,
    paymentMethod: "paymentReceive",
    phoneNumber: "",
    province: "",
    provinceId: "",
    totalMoney: totalMoney,
    userName: "",
    ward: "",
    wardCode: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const [moneyShip, setMoneyShip] = useState(0);
  const [dayShip, setDayShip] = useState("");
  const [keyMethodPayment, setKeyMethodPayment] = useState("paymentReceive");

  const [totalBill, setTotalBill] = useState(0);
  const [totalBillToPay, setTotalBillToPay] = useState(0);
  const [formGetMoneyShip, setFormGetMoneyShip] = useState([]);

  const comercial = [
    { title: "CHÀO MỪNG QUÝ KHÁCH!" },
    { title: " CHÚC QUÝ KHÁCH MUA HÀNG HAPPY!" },
    { title: " FREE SHIPPING VỚI HÓA ĐƠN TRÊN 2 TRIỆU!" },
  ];
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const socket = new SockJS("http://localhost:8080/ws");
  const stompClient = Stomp.over(socket);
  useEffect(() => {
    console.log(formErrors);
  }, [formErrors]);
  useEffect(() => {
    getCities();
    const totalPrice = listproductOfBill.reduce(
      (total, item) =>
        total +
        parseInt(
          (parseInt(item.price) -
            parseInt(item.price) * (item.valuePromotion / 100)) *
          item.quantity
        ),
      0
    );
    setTotalBill(totalPrice);

    const interval = setInterval(() => {
      setCurrentTitleIndex((prevIndex) => (prevIndex + 1) % comercial.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    let discountAmount = 0;
    if (voucher.value <= 100) {
      discountAmount = (totalBill * voucher.value) / 100;
      if (discountAmount > voucher.maxDiscount) {
        discountAmount = voucher.maxDiscount;
      }
    } else {
      discountAmount = voucher.value;
    }
    setTotalBillToPay(totalBill - discountAmount);
    console.log("Check bill ", totalBill);

    formBillChange("afterPrice", totalBill);
    const updatedListproductOfBill = listproductOfBill.map((item) => {
      const { nameProduct, nameSize, image, ...rest } = item;
      return rest;
    });
    setFormBill((prevFormBill) => ({
      ...prevFormBill,
      itemDiscount: discountAmount,
      idVoucher: voucher.idVoucher,
      billDetail: updatedListproductOfBill,
      afterPrice: totalBill,
    }));
  }, [totalBill]);

  useEffect(() => {
    console.log(formBill);
  }, [formBill]);
  useEffect(() => {
    console.log(formGetMoneyShip);
  }, [formGetMoneyShip]);
  useEffect(() => {
    console.log(dayShip);
  }, [dayShip]);
  useEffect(() => {
    setTotalBillToPay(totalBillToPay - formBill.moneyShip + moneyShip);
    setFormBill({ ...formBill, moneyShip: moneyShip });
  }, [moneyShip]);

  useEffect(() => {
    if (formGetMoneyShip.ward === "") {
      setDayShip("");
    } else {
      getDayShip(formGetMoneyShip.district, formGetMoneyShip.ward);
      getMoneyShip(formGetMoneyShip.district, formGetMoneyShip.ward);
    }
  }, [formGetMoneyShip.ward]);
  useEffect(() => {
    console.log(keyMethodPayment);
  }, [keyMethodPayment]);

  const payment = () => {
    const phoneNumberPattern =
      /^(03[2-9]|05[6-9]|07[0-9]|08[1-9]|09[0-9])[0-9]{7}$/;

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const isFormValid =
      formBill.userName &&
      formBill.phoneNumber &&
      phoneNumberPattern.test(formBill.phoneNumber) &&
      formBill.email &&
      emailPattern.test(formBill.email) &&
      formBill.address &&
      formBill.province &&
      formBill.district &&
      formBill.ward;

    if (!isFormValid) {
      const errors = {
        userName: !formBill.userName ? "Vui lòng nhập họ tên" : "",
        phoneNumber: !formBill.phoneNumber
          ? "Vui lòng nhập số điện thoại"
          : !phoneNumberPattern.test(formBill.phoneNumber)
            ? "Vui lòng nhập đúng định dạng số điện thoại"
            : "",
        email: !formBill.email
          ? "Vui lòng nhập email"
          : !emailPattern.test(formBill.email)
            ? "Vui lòng nhập đúng định dạng email"
            : "",
        address: !formBill.address ? "Vui lòng nhập địa chỉ" : "",
        province:
          formBill.province === undefined || !formBill.province
            ? "Vui lòng chọn tỉnh/thành phố"
            : "",
        district:
          formBill.district === undefined || !formBill.district
            ? "Vui lòng chọn quận/huyện"
            : "",
        ward:
          formBill.ward === undefined || !formBill.ward
            ? "Vui lòng chọn phường/xã"
            : "",
      };
      setFormErrors(errors);
      return;
    }

    Modal.confirm({
      title: "Xác nhận đặt hàng",
      content: "Bạn có chắc chắn muốn đặt hàng ?",
      okText: "Đặt hàng",
      okType: "primary",
      cancelText: "Hủy",
      onOk() {
        const dataBillSave = {
          ...formBill,
          shippingTime: dayShip,
          totalMoney: totalBill,
        };
        console.log(dataBillSave);

        if (formBill.paymentMethod === "paymentVnpay") {
          const data = {
            vnp_Ammount: totalBillToPay,
            billDetail: formBill.billDetail,
          };
          PaymentApi.paymentVnpay(data).then(
            (res) => {
              window.location.replace(res.data.data);
              sessionStorage.setItem("formBill", JSON.stringify(dataBillSave));
            },
            (err) => {
              console.log(err);
            }
          );
        } else {
          BillApi.createBillOnline(dataBillSave).then(
            (res) => {
              stompClient.send("/action/notifyAdmin", {}, "");
              const cartLocal = JSON.parse(localStorage.getItem("cartLocal"));
              const updatelist = cartLocal.filter((item) => {
                return !formBill.billDetail.some(
                  (itemBill) =>
                    item.idProductDetail === itemBill.idProductDetail
                );
              });
              const total = updatelist.reduce(
                (acc, item) => acc + item.quantity,
                0
              );
              updateTotalQuantity(total);
              localStorage.setItem("cartLocal", JSON.stringify(updatelist));
              toast.success("Bạn đặt hàng thành công.");

              navigate(`/home`);
            },
            (err) => { }
          );
        }
      },
    });
  };

  const getCities = () => {
    AddressApi.getAllProvince().then(
      (res) => {
        setListCity(res.data.data);
      },
      (err) => {
        console.log(err);
      }
    );
  };
  const provinceChange = (value) => {
    if (value === "") {
      setListDistrict([]);
      setListWard([]);
      formBillChange("district", undefined);
      formBillChange("districtId", "");
      formBillChange("ward", undefined);
      formBillChange("wardCode", "");
      setTotalBillToPay(totalBillToPay - moneyShip);
      setMoneyShip(0);
    } else {
      AddressApi.getAlldistrict(value).then(
        (res) => {
          setListDistrict(res.data.data);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  };

  const districtChange = (name, value) => {
    if (value === "") {
      formBillChange("ward", undefined);
      formBillChange("wardCode", "");
      setListWard([]);
      setTotalBillToPay(totalBillToPay - moneyShip);
      setMoneyShip(0);
    } else {
      setFormGetMoneyShip({ ...formGetMoneyShip, [name]: value });
      AddressApi.getAllWard(value).then(
        (res) => {
          setListWard(res.data.data);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  };
  const wardChange = (name, value) => {
    if (value === "") {
      setTotalBillToPay(totalBillToPay - moneyShip);
      setMoneyShip(0);
    }
    setFormGetMoneyShip({ ...formGetMoneyShip, [name]: value });
  };
  const getMoneyShip = (districtId, wardCode) => {
    if (totalBill >= 2000000) {
      setMoneyShip(0);
    } else {
      AddressApi.getMoneyShip(districtId, wardCode).then(
        (res) => {
          setMoneyShip(res.data.data.total);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  };
  const getDayShip = (districtId, wardCode) => {
    AddressApi.getDayShip(districtId, wardCode).then(
      (res) => {
        const leadtimeInSeconds = res.data.data.leadtime;
        const formattedDate = moment
          .unix(leadtimeInSeconds)
          .format("DD/MM/YYYY");
        setDayShip(formattedDate);
      },
      (err) => {
        console.log(err);
      }
    );
  };
  const formatMoney = (price) => {
    return (
      parseInt(price)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND"
    );
  };
  const formatMoney1 = (price, maxDiscount) => {
    // Nếu giá trị price là 0 (trường hợp giảm 0%)
    if (price == 0) {
      return price.toFixed(0) + " VND";
    }

    // Nếu price là phần trăm, tính số tiền giảm
    if (price < 1000) {
      let discountAmount = (totalBill * price) / 100;
      let maxDiscount = voucher.maxDiscount;
      if (discountAmount > maxDiscount) {
        discountAmount = maxDiscount;
      }
      return (
        discountAmount
          .toFixed(0) // Làm tròn số tiền giảm
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND"
      );
    }

    // Trường hợp giá trị lớn hơn 1000 thì coi là số tiền trực tiếp (không phải phần trăm)
    return (
      price
        .toFixed(0) // Làm tròn số tiền
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND"
    );
  };

  const formBillChange = (name, value) => {
    setFormBill((prevFormBill) => ({
      ...prevFormBill,
      [name]: value,
    }));
    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      [name]: "",
    }));
  };

  const paymentReceive = () => {
    setKeyMethodPayment("paymentReceive");
    setFormBill({ ...formBill, paymentMethod: "paymentReceive" });
  };
  const paymentVnpay = () => {
    setKeyMethodPayment("paymentVnpay");
    setFormBill({ ...formBill, paymentMethod: "paymentVnpay" });
  };

  return (
    <div className="payment">
      {/* <div className="comercial">{comercial[currentTitleIndex].title}</div> */}

      <div className="bill">
        <Row>
          <Col lg={{ span: 18, offset: 3 }} className="bill-content">
            <div className="info-shipping">
              <div className="title-info-shipping">THÔNG TIN GIAO HÀNG</div>
              <div className="form-address">
                <Form layout="vertical">
                  <Row gutter={16}>
                    <Col span={12}>
                      <label htmlFor="" className="lable">
                        Họ và tên:
                      </label>
                      <Form.Item
                        validateStatus={formErrors["userName"] ? "error" : ""}
                        help={formErrors["userName"] || ""}
                      >
                        <Input
                          className="input-form-payment"
                          value={formBill["userName"]}
                          onChange={(e) =>
                            formBillChange("userName", e.target.value)
                          }
                          style={{ fontSize: "15px" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <label htmlFor="" className="lable">
                        Số điện thoại:
                      </label>
                      <Form.Item
                        validateStatus={
                          formErrors["phoneNumber"] ? "error" : ""
                        }
                        help={formErrors["phoneNumber"] || ""}
                      >
                        <Input
                          className="input-form-payment"
                          onChange={(e) =>
                            formBillChange("phoneNumber", e.target.value)
                          }
                          style={{ fontSize: "15px" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <label htmlFor="" className="lable">
                        Email:
                      </label>
                      <Form.Item
                        validateStatus={formErrors["email"] ? "error" : ""}
                        help={formErrors["email"] || ""}
                      >
                        <Input
                          className="input-form-payment"
                          onChange={(e) =>
                            formBillChange("email", e.target.value)
                          }
                          style={{ fontSize: "15px" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <label htmlFor="" className="lable">
                        Tỉnh/Thành phố:
                      </label>
                      <Form.Item
                        validateStatus={formErrors["province"] ? "error" : ""}
                        help={formErrors["province"] || ""}
                      >
                        <select
                          style={{
                            paddingLeft: "10px",
                            fontSize: 17,
                          }}
                          className="input-form-payment"
                          onChange={(e) => {
                            const selectedValue = e.target.value; // Lấy giá trị đã chọn (bao gồm cả ProvinceID và ProvinceName)
                            const [provinceID, provinceName] =
                              selectedValue.split("|"); // Tách giá trị thành ProvinceID và ProvinceName
                            // Bây giờ bạn có thể sử dụng provinceID và provinceName theo nhu cầu
                            provinceChange(provinceID); // Gọi hàm provinceChange với ProvinceID
                            formBillChange("province", provinceName);
                            formBillChange("provinceId", provinceID);
                          }}
                        >
                          <option value="">Chọn</option>
                          {listCity.map((item, index) => (
                            <option
                              key={index}
                              value={`${item.ProvinceID}|${item.ProvinceName}`}
                            >
                              {item.ProvinceName}
                            </option>
                          ))}
                        </select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <div style={{ display: "flex" }}>
                    <Form.Item
                      style={{ marginRight: "20px", width: "100%" }}
                      validateStatus={formErrors["district"] ? "error" : ""}
                      help={formErrors["district"] || ""}
                    >
                      <label htmlFor="" className="lable">
                        Quận/Huyện:
                      </label>
                      <select
                        style={{
                          paddingLeft: "10px",
                          fontSize: 17,
                          borderRadius: "5px",
                        }}
                        className="input-district"
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          const [districtID, districtName] =
                            selectedValue.split("|");
                          districtChange("district", districtID);
                          formBillChange("district", districtName);
                          formBillChange("districtId", districtID);
                        }}
                      >
                        <option value="">Chọn</option>
                        {listDistrict.map((item, index) => (
                          <option
                            key={index}
                            value={`${item.DistrictID}|${item.DistrictName}`}
                          >
                            {item.DistrictName}
                          </option>
                        ))}
                      </select>
                    </Form.Item>

                    <Form.Item
                      style={{ width: "100%" }}
                      validateStatus={formErrors["ward"] ? "error" : ""}
                      help={formErrors["ward"] || ""}
                    >
                      <label htmlFor="" className="lable">
                        Phường:
                      </label>
                      <select
                        style={{
                          paddingLeft: "10px",
                          fontSize: 17,
                          borderRadius: "5px",
                        }}
                        className="input-ward"
                        onChange={(e) => {
                          const selectedValue = e.target.value; // Lấy giá trị đã chọn (bao gồm cả ProvinceID và ProvinceName)
                          const [WardCode, WardName] = selectedValue.split("|"); // Tách giá trị thành ProvinceID và ProvinceName
                          // Bây giờ bạn có thể sử dụng provinceID và provinceName theo nhu cầu
                          wardChange("ward", WardCode); // Gọi hàm provinceChange với ProvinceID
                          formBillChange("ward", WardName);
                          formBillChange("wardCode", WardCode);
                        }}
                      >
                        <option value="">Chọn</option>
                        {listWard.map((item, index) => (
                          <option
                            key={index}
                            value={`${item.WardCode}|${item.WardName}`}
                          >
                            {item.WardName}
                          </option>
                        ))}
                      </select>
                    </Form.Item>
                  </div>
                  <label htmlFor="" className="lable">
                    Địa chỉ cụ thể:
                  </label>
                  <Form.Item
                    validateStatus={formErrors["address"] ? "error" : ""}
                    help={formErrors["address"] || ""}
                  >
                    <Input
                      className="input-form-payment"
                      placeholder="Địa chỉ cụ thể"
                      onChange={(e) =>
                        formBillChange("address", e.target.value)
                      }
                      style={{ fontSize: "15px" }}
                    />
                  </Form.Item>
                </Form>
              </div>

              <div className="title-method-payment">HÌNH THỨC THANH TOÁN</div>
              <div className="method-payment">
                <div
                  className={`payment-when-recevie ${keyMethodPayment === "paymentReceive" ? "click" : ""
                    }`}
                  onClick={paymentReceive}
                  style={{ backgroundColor: "white" }}
                >
                  Thanh toán khi nhận hàng
                  <img
                    style={{ width: "40px", marginLeft: "10px" }}
                    src="https://dacaocapcyvy.com.vn/public/uploads/news/thanh-toan-khi-nhan-hang-15111809124411.jpg"
                    alt="..."
                  />
                </div>
                <div
                  className={`payment-by-vnpay ${keyMethodPayment === "paymentVnpay" ? "click" : ""
                    }`}
                  onClick={paymentVnpay}
                  style={{ backgroundColor: "white" }}
                >
                  Thanh toán VnPay{" "}
                  <img
                    style={{ width: "40px", marginLeft: "20px" }}
                    src={logoVnPay}
                    alt="..."
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "50px",
                  marginLeft: "130px",
                }}
              >
                {dayShip !== "" && (
                  <>
                    {" "}
                    <img
                      src={
                        "https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-GHN-Slogan-En.png"
                      }
                      style={{
                        width: "110px",
                        marginLeft: "5px",
                        marginRight: "10px",
                      }}
                    />
                    <span style={{ fontSize: "17px" }}>
                      {" "}
                      Thời gian nhận hàng dự kiến: {dayShip}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="info-bill-payment">
              <div className="content-info-bill-payment">
                <div className="title-bill-payment">THÔNG TIN ĐƠN HÀNG</div>
                <div
                  style={{
                    borderBottom: "1px solid black",
                    marginBottom: "30px",
                  }}
                >
                  {listproductOfBill.map((item, index) => (
                    <div
                      style={{
                        marginBottom: "30px",
                      }}
                    >
                      <div style={{ display: "flex", marginBottom: "10px" }}>
                        <p
                          style={{
                            fontSize: "17px",
                            color: " black",
                            fontWeight: "500",
                          }}
                        >
                          {item.nameProduct}
                        </p>{" "}
                        <p
                          style={{
                            fontSize: "17px",
                            marginLeft: "10px",
                            color: "black",
                          }}
                        >
                          {item.valuePromotion !== null ? (
                            <span style={{}}>
                              {" "}
                              {formatMoney(
                                item.price -
                                item.price * (item.valuePromotion / 100)
                              )}
                            </span>
                          ) : (
                            formatMoney(item.price)
                          )}
                        </p>
                      </div>
                      <div style={{ display: "flex" }}>
                        <p style={{ fontSize: "17px", color: "black" }}>
                          Size : {item.nameSize}
                        </p>{" "}
                        <p
                          style={{
                            fontSize: "17px",
                            marginLeft: "auto",
                            color: "black",
                          }}
                        >
                          <span>SL: {item.quantity}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", marginBottom: "5px" }}>
                  <p
                    style={{
                      fontSize: "17px",
                      color: "black",
                      fontWeight: "400",
                    }}
                  >
                    TỔNG HÓA ĐƠN :
                  </p>{" "}
                  <p
                    style={{
                      fontSize: "17px",
                      marginLeft: "auto",
                      color: "black",
                    }}
                  >
                    {formatMoney(totalBill)}
                  </p>
                </div>
                <div style={{ display: "flex", marginBottom: "10px" }}>
                  <p
                    style={{
                      fontSize: "17px",
                      color: "black",
                      fontWeight: "400",
                    }}
                  >
                    GIẢM GIÁ :
                  </p>{" "}
                  <p
                    style={{
                      fontSize: "17px",
                      marginLeft: "auto",
                      color: "black",
                    }}
                  >
                    {voucher.value == 0
                      ? `${formatMoney1(voucher.value, voucher.maxDisocunt)}`
                      : `${formatMoney1(voucher.value, voucher.maxDisocunt)}`}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    marginBottom: "10px",
                  }}
                >
                  <p style={{ fontSize: "17px", fontWeight: "400" }}>
                    PHÍ VẬN CHUYỂN:
                  </p>{" "}
                  <p
                    style={{
                      fontSize: "17px",
                      marginLeft: "auto",
                      color: "black",
                    }}
                  >
                    {formatMoney(moneyShip)}
                  </p>
                </div>

                <div style={{ display: "flex", marginBottom: "50px" }}>
                  <p style={{ fontSize: "17px", fontWeight: "400" }}>
                    TỔNG TIỀN :
                  </p>{" "}
                  <p
                    style={{
                      fontSize: "17px",
                      marginLeft: "auto",
                      color: " #ff4400",
                      fontWeight: "400",
                    }}
                  >
                    {formatMoney(totalBillToPay)}
                  </p>
                </div>
                <div className="button-submit-buy" onClick={payment}>
                  ĐẶT HÀNG
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
export default Payment;
