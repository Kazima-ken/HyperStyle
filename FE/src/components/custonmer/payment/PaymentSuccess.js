import "./style-payment-success.css";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BillApi } from "./../../../api/admin/bill/billApi";
import {
  faSquareCheck,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useCart } from "../cart/CartService";
import { PaymentApi } from "../../../api/customer/payment/PaymentApi";
import { CartApi } from "./../../../api/customer/card/CardApi";
function PayMentSuccess() {
  const idAccount = sessionStorage.getItem("idAccount");
  const urlObject = new URL(window.location.href);
  const vnp_ResponseCode = urlObject.searchParams.get("vnp_ResponseCode");
  const vnp_Amount = urlObject.searchParams.get("vnp_Amount");
  const formBill = JSON.parse(sessionStorage.getItem("formBill"));
  const { updateTotalQuantity } = useCart();
  useEffect(() => {
    if (vnp_ResponseCode === "00") {
      if (formBill !== null) {
        console.log(formBill);
        const params = new URLSearchParams(window.location.search);
        const paramsObj = {};

        // Lặp qua các tham số và gán chúng vào đối tượng JSON.
        params.forEach((value, key) => {
          paramsObj[key] = value;
        });
        formBill.responsePayment = paramsObj;
        onPayment(formBill);
      }
    } else {
      console.log(formBill.billDetail);
      PaymentApi.refundQuantityProductDetail(formBill.billDetail);
    }
  }, []);
  const formatMoney = (price) => {
    return (
      parseInt(price)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND"
    );
  };
  const onPayment = (formBill) => {
    if (idAccount !== null) {
      BillApi.createBillAccountOnline(formBill).then(
        (res) => {
          CartApi.quantityInCart(idAccount).then(
            (res) => {
              updateTotalQuantity(res.data.data);
            },
            (err) => {
              console.log(err);
            }
          );
        },
        (err) => {
          console.log(err);
        }
      );
      sessionStorage.removeItem("formBill");
    } else {
      BillApi.createBillOnline(formBill).then(
        (res) => {
          console.log("thanh toán khi nhận hàng!");
          const cartLocal = JSON.parse(localStorage.getItem("cartLocal"));
          const updatelist = cartLocal.filter((item) => {
            // Kiểm tra xem item.idProductDetail có tồn tại trong formBill.billDetail hay không
            return !formBill.billDetail.some(
              (itemBill) => item.idProductDetail === itemBill.idProductDetail
            );
          });
          const total = updatelist.reduce(
            (acc, item) => acc + item.quantity,
            0
          );
          updateTotalQuantity(total);
          localStorage.setItem("cartLocal", JSON.stringify(updatelist));
        },
        (err) => {
          console.log(err);
        }
      );
    }
  };
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const createFireworks = (num = 10) => {
    const fireworks = [];
    for (let i = 0; i < num; i++) {
      const color = getRandomColor(); // Màu ngẫu nhiên cho mỗi quả pháo
      fireworks.push(
        <div
          key={i}
          className="firework"
          style={{ backgroundColor: color }}
        ></div>
      );
    }
    return fireworks;
  };
  return (
    <>
      <div className="fireworks-container">
        {/* Hiển thị các pháo từ vị trí ngẫu nhiên */}
        {createFireworks(10)}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {vnp_ResponseCode === "00" ? (
          <div className="content-payment-success">
            <h1>Thanh toán đơn hàng thành công</h1>
            <div style={{ marginTop: "5%" }}>
              Tổng tiền đơn hàng : {formatMoney(vnp_Amount / 100)}
            </div>
            <div style={{ marginTop: "10px", textDecoration: "none" }}>
              <Link to="/home" style={{ textDecoration: "none" }}>
                Tiếp tục mua hàng
              </Link>
            </div>
          </div>
        ) : (
          <div className="content-payment-success">
            <FontAwesomeIcon
              className="icon-payment-fail"
              icon={faTriangleExclamation}
            />
            <h1>Thanh toán thất bại</h1>
            <div>
              <Link to={idAccount === null ? "/payment" : "/payment-acc"}>
                Thử lại
              </Link>
              <Link style={{ marginLeft: "10px" }} to="/home">
                Tiếp tục mua
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default PayMentSuccess;
