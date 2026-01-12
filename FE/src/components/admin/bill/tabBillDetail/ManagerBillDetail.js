import { Button, Col, Modal, Row, Tabs } from "antd";
import React from "react";
import TabBillDetail from "./TabBillDetail";
import "./tabBillDetail.css";

function ManagerBillDetail({ id, status }) {
  const listtab = [null, "THANH_CONG", "TRA_HANG"];

  const convertString = (key) => {
    if (key === null) return "Tất cả sản phẩm";
    if (key === "THANH_CONG") return "Sản phẩm mua thành công";
    return "Sản phẩm trả hàng";
  };

  return (
    <Row style={{ width: "100%" }}>
      {status !== "TRA_HANG" ? (
        <TabBillDetail
          style={{ width: "100%" }}
          dataBillDetail={{ idBill: id, status: "THANH_CONG" }}
        />
      ) : (
        <Tabs
          type="card"
          style={{ width: "100%" }}
          items={listtab.map((item) => ({
            label: <span>{convertString(item)}</span>,
            key: item || "all",
            children: (
              <TabBillDetail
                style={{ width: "100%" }}
                dataBillDetail={{ idBill: id, status: item }}
              />
            ),
          }))}
        />
      )}
    </Row>
  );
}

export default ManagerBillDetail;