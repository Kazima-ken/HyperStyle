/* eslint-disable jsx-a11y/alt-text */
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, InputNumber, message, Modal, Row, Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import TextArea from "antd/es/input/TextArea";
import { BillApi } from "../../../../api/admin/bill/billApi";
import {
  ChangeProductInBill,
  updateTotalBill,
} from "../../../../app/reducer/BillReducer";
import { dispatch } from "../../../../app/store";
import "./tabBillDetail.css";

function TabBillDetail({ dataBillDetail }) {
  const bill = useSelector((state) => state.bill.bill.value);
  const changeQuanTiTy = useSelector((state) => state.bill.bill.change);
  const [billDetai, setBillDetail] = useState([]);

  // Lấy status chuẩn
  const currentStatus = bill.statusBill || bill.billStatus;

  // --- HÀM AN TOÀN: Ép kiểu số để tránh NaN ---
  const safeNumber = (val) => {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  };

  const formatCurrency = (value) => {
    if (value === undefined || value === null || isNaN(value)) return "0 VND";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      currencyDisplay: "code",
    }).format(value);
  };

  // Tính tổng tiền cho 1 dòng sản phẩm
  const totalMoneyProduct = (product) => {
    const price = safeNumber(product.price);
    const quantity = safeNumber(product.quantity);
    const promotion = safeNumber(product.promotion);

    if (promotion <= 0) {
      return price * quantity;
    } else {
      return (price * (100 - promotion) * quantity) / 100;
    }
  };

  const handleQuantityChange = (value, record) => {
    const quantityCustom = parseInt(value);
    const currentQty = safeNumber(record.quantity);
    const maxQty = safeNumber(record.maxQuantity);

    let limit = maxQty;
    if (record.promotion == null) {
      limit = maxQty + currentQty;
    } else {
      limit = currentQty;
    }

    if (!quantityCustom || quantityCustom < 1) {
      // Do nothing
    } else if (quantityCustom > limit && record.promotion == null) {
      message.warning(`Số lượng tối đa trong kho là ${limit}`);
    } else {
      const updatedProducts = billDetai.map((p) =>
        p.id === record.idProduct ? record : p
      );

      const newTotalBill = updatedProducts.reduce((acc, curr) => {
        return acc + totalMoneyProduct(curr);
      }, 0);

      const data = {
        idBill: bill.id,
        idProduct: record.idProduct,
        quantity: quantityCustom,
        totalMoney: newTotalBill,
        price: record.price,
        promotion: record.promotion,
      };

      Modal.confirm({
        title: "Xác nhận đổi số lượng",
        content: (
          <div>
            <p>Bạn muốn sửa số lượng thành <b>{quantityCustom}</b>?</p>
            <TextArea id="noteInputQuantity" rows={3} placeholder="Nhập lý do thay đổi..." />
          </div>
        ),
        okText: "Đồng ý",
        cancelText: "Hủy",
        onOk: async () => {
          const note = document.getElementById("noteInputQuantity").value;
          if (note && note.trim().length >= 5) {
            data.note = note;
            try {
              await BillApi.updateProductInBill(record.id, data);
              message.success("Sửa số lượng thành công");
              dispatch(updateTotalBill(data.totalMoney));
              dispatch(ChangeProductInBill(changeQuanTiTy + 1));
            } catch (error) {
              message.error(error.response?.data?.message || "Lỗi cập nhật");
            }
          } else {
            message.warning("Vui lòng nhập ghi chú (tối thiểu 5 ký tự)");
          }
        },
      });
    }
  };

  const handleDelete = (record) => {
    if (billDetai.length <= 1) {
      message.warning("Không thể xóa hết sản phẩm trong đơn hàng!");
      return;
    }
    Modal.confirm({
      title: "Xác nhận xóa",
      content: (
        <div>
          <p>Xóa sản phẩm <b>{record.productName}</b> khỏi đơn?</p>
          <TextArea id="noteDeleteProduct" rows={3} placeholder="Nhập lý do xóa..." />
        </div>
      ),
      okText: "Xóa",
      okButtonProps: { danger: true },
      cancelText: "Hủy",
      onOk: async () => {
        const note = document.getElementById("noteDeleteProduct").value;
        if (note && note.trim().length >= 5) {
          try {
            await BillApi.removeProductInBill(record.id, record.idProduct, note);
            message.success("Đã xóa sản phẩm");
            dispatch(ChangeProductInBill(changeQuanTiTy + 1));
          } catch (error) {
            message.error("Lỗi xóa sản phẩm");
          }
        } else {
          message.warning("Vui lòng nhập lý do xóa (tối thiểu 5 ký tự)");
        }
      },
    });
  };

  const columnProductBill = [
    { title: "STT", key: "stt", align: "center", width: 60, render: (_, __, index) => index + 1 },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      align: "center",
      width: 100,
      render: (text, record) => (
        <div style={{ position: "relative", display: "inline-block" }}>
          <img src={text} alt="Product" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "5px", border: "1px solid #eee" }} />
          {safeNumber(record.promotion) > 0 && (
            <span style={{ position: "absolute", top: -5, right: -5, background: "red", color: "#fff", fontSize: "10px", padding: "2px 5px", borderRadius: "10px" }}>
              -{record.promotion}%
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Thông tin sản phẩm",
      key: "productName",
      dataIndex: "productName",
      render: (_, record) => {
        const price = safeNumber(record.price);
        return (
          <div>
            <div style={{ fontSize: "15px", fontWeight: "bold" }}>{record.productName}</div>
            <div style={{ color: "gray" }}>Size: {record.nameSize}</div>
            {safeNumber(record.promotion) > 0 ? (
              <div>
                <span style={{ color: "red", fontWeight: "bold", marginRight: "8px" }}>
                  {formatCurrency(price * (100 - record.promotion) / 100)}
                </span>
                <span style={{ textDecoration: "line-through", color: "#bbb" }}>
                  {formatCurrency(price)}
                </span>
              </div>
            ) : (
              <div style={{ fontWeight: "500" }}>{formatCurrency(price)}</div>
            )}
          </div>
        )
      },
    },
    {
      title: "Màu",
      dataIndex: "codeColor",
      key: "codeColor",
      align: "center",
      width: 80,
      render: (color) => (
        <div style={{ backgroundColor: color, width: "30px", height: "30px", borderRadius: "50%", border: "1px solid #ccc", margin: "0 auto" }} />
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      width: 100,
      render: (qty) => <span style={{ fontWeight: "bold" }}>{qty}</span>
    },
    {
      title: "Tổng tiền",
      key: "totalPrice",
      align: "center",
      width: 150,
      render: (_, record) => (
        <span style={{ color: "#d4380d", fontWeight: "bold" }}>
          {formatCurrency(totalMoneyProduct(record))}
        </span>
      ),
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 140, // Đã tăng width để không bị chật
      render: (text) => (
        <span style={{
          padding: "4px 12px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: "500",
          backgroundColor: text === "THANH_CONG" ? "#f6ffed" : "#fff1f0",
          color: text === "THANH_CONG" ? "#52c41a" : "#f5222d",
          border: `1px solid ${text === "THANH_CONG" ? "#b7eb8f" : "#ffa39e"}`,
          whiteSpace: "nowrap",      // FIX LỖI: Không cho xuống dòng
          display: "inline-block"    // FIX LỖI: Giữ khối hiển thị đẹp
        }}>
          {text === "THANH_CONG" ? "Thành công" : "Hoàn hàng"}
        </span>
      ),
    },
  ];

  const columneEditProductBill = [
    ...columnProductBill.slice(0, 4),
    {
      title: "Số lượng",
      key: "quantity",
      align: "center",
      dataIndex: "quantity",
      width: 120,
      render: (_, record) => (
        <InputNumber
          min={1}
          max={record.promotion == null ? safeNumber(record.maxQuantity) + safeNumber(record.quantity) : safeNumber(record.quantity)}
          defaultValue={safeNumber(record.quantity)}
          onPressEnter={(e) => handleQuantityChange(e.target.value, record)}
          onBlur={(e) => handleQuantityChange(e.target.value, record)}
          style={{ width: "100%" }}
          disabled
        />
      ),
    },
    ...columnProductBill.slice(5, 7)
  ];

  useEffect(() => {
    if (dataBillDetail?.idBill) {

      const requestData = {
        ...dataBillDetail,
        status: "THANH_CONG"
      };

      BillApi.getAllProductsInBillByIdBill(requestData)
        .then((res) => {
          setBillDetail(res.data.data);
        })
        .catch((err) => console.log(err));
    }

  }, [changeQuanTiTy, dataBillDetail]);

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      {billDetai.length > 0 ? (
        <Table
          className="table-bill-detail"
          columns={
            currentStatus === "CHO_XAC_NHAN" || currentStatus === "TAO_DON_HANG"
              ? columneEditProductBill
              : columnProductBill
          }
          dataSource={billDetai}
          rowKey="id"
          pagination={false}
          scroll={{ x: 'max-content' }}
          style={{ width: "100%" }}
        />
      ) : (
        <Row justify="center" style={{ padding: "20px" }}>
          <span>Không có sản phẩm nào</span>
        </Row>
      )}
    </div>
  );
}

export default TabBillDetail;