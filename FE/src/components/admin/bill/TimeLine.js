import moment from "moment";
import React from "react";
import "./timeline.css";

function TimeLine({ data = [], statusPresent }) {

  const getTitle = (status) => {
    switch (status) {
      case "TAO_HOA_DON": return "Tạo hóa đơn";
      case "CHO_XAC_NHAN": return "Chờ xác nhận";
      case "XAC_NHAN": return "Đã xác nhận";
      case "CHO_VAN_CHUYEN": return "Chờ vận chuyển";
      case "VAN_CHUYEN": return "Đang vận chuyển";
      case "DA_THANH_TOAN": return "Đã thanh toán";
      case "THANH_CONG": return "Hoàn thành";
      case "TRA_HANG": return "Trả hàng";
      case "DA_HUY": return "Đã hủy";
      default: return status;
    }
  };

  const getStepClass = (status, index) => {
    if (status === "DA_HUY" || status === "TRA_HANG") return "step danger";
    if (index === statusPresent) return "step active";
    if (index < statusPresent) return "step done";
    return "step";
  };

  return (
    <div className="timeline-wrapper">
      {data
        .filter(item => item.billStatus)
        .map((item, index) => (
          <div className={getStepClass(item.billStatus, index)} key={item.id || index}>
            <div className="step-index">{index + 1}</div>

            <div className="step-content">
              <div className="step-title">{getTitle(item.billStatus)}</div>
              <div className="step-time">
                {moment(item.createDate).format("HH:mm DD/MM/YYYY")}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default TimeLine;
