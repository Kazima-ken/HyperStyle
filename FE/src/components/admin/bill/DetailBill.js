import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Form,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  Skeleton,
  message,
} from "antd";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useReactToPrint } from "react-to-print";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  CreditCardOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  HistoryOutlined,
  PhoneOutlined,
  RollbackOutlined,
  UserOutlined,
} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

// API & Redux imports
import { BillApi } from "../../../api/admin/bill/billApi";
import { PaymentsMethodApi } from "../../../api/admin/paymentMethod/PaymentsMethodApi";
import { AddressApi } from "../../../api/admin/address/addressApi";
import {
  addBillHistory,
  addStatusPresent,
  getBill,
  getBillHistory,
  getPaymentsMethod,
} from "../../../app/reducer/BillReducer";

// Components
import TimeLine from "./TimeLine";
import ManagerBillDetail from "./tabBillDetail/ManagerBillDetail";
import TabBillDetail from "./tabBillDetail/TabBillDetail";
import "./detail.css";

const { Text, Title } = Typography;

// --- CONSTANTS & HELPERS ---
// Sắp xếp đúng thứ tự quy trình bạn mong muốn
const listStatus = [
  { id: 0, name: "Tạo hóa đơn", status: "TAO_HOA_DON" }, // (Tùy chọn, nếu có)
  { id: 1, name: "Chờ xác nhận", status: "CHO_XAC_NHAN" },
  { id: 2, name: "Đã xác nhận", status: "XAC_NHAN" },
  { id: 3, name: "Chờ vận chuyển", status: "CHO_VAN_CHUYEN" },
  { id: 4, name: "Đang vận chuyển", status: "VAN_CHUYEN" },
  { id: 5, name: "Đã thanh toán", status: "DA_THANH_TOAN" },
  { id: 6, name: "Thành công", status: "THANH_CONG" },
  { id: 7, name: "Trả hàng", status: "TRA_HANG" },
  { id: 8, name: "Đã hủy", status: "DA_HUY" },
];

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    currencyDisplay: "code",
  }).format(value);
};

const getStatusLabel = (status) => {
  switch (status) {
    case "TAO_HOA_DON": return "Hóa đơn chờ";
    case "CHO_XAC_NHAN": return "Chờ xác nhận";
    case "XAC_NHAN": return "Đã xác nhận";
    case "CHO_VAN_CHUYEN": return "Chờ vận chuyển";
    case "VAN_CHUYEN": return "Đang vận chuyển";
    case "DA_THANH_TOAN": return "Đã thanh toán";
    case "TRA_HANG": return "Trả hàng";
    case "THANH_CONG": return "Thành công";
    case "DA_HUY": return "Đã hủy";
    default: return "";
  }
};

const getPaymentMethodLabel = (method) => {
  if (method === "TIEN_MAT") return "Tiền mặt";
  if (method === "CHUYEN_KHOAN") return "Chuyển khoản";
  return "Tiền mặt & CK";
};

// --- MAIN COMPONENT ---
function DetailBill() {
  const callCount = useRef(0);
  const params = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const idFromQuery = queryParams.get("idBill");
  const idFromParams = params.id;

  const id = idFromQuery || idFromParams;

  const dispatch = useDispatch();
  const formRef = useRef(null);
  const [form] = Form.useForm();
  useEffect(() => {
    console.log("Current ID:", id);
    if (id) {
      loadData(); // Chỉ load data khi chắc chắn có ID
    }
  }, [id]);

  // Redux Selectors
  const [targetStatus, setTargetStatus] = useState("");
  const billHistory = useSelector((state) => state.bill.bill.billHistory);
  const paymentsMethod = useSelector((state) => state.bill.bill.paymentsMethod);
  const bill = useSelector((state) => state.bill.bill.value);
  const statusPresent = useSelector((state) => state.bill.bill.status);
  const changeQuanTiTy = useSelector((state) => state.bill.bill.change);

  // Local State
  const [statusBill, setStatusBill] = useState({
    actionDescription: "",
    method: "TIEN_MAT",
    transaction: "",
    status: "THANH_TOAN",
  });

  const logApiCall = (apiName) => {
    callCount.current += 1;
    console.log(`[Thứ tự ${callCount.current}] Đang gọi API: ${apiName}`);
  };

  const [payMentNo, setPayMentNo] = useState(false);
  const [shipFeeCustomer, setShipFeeCustomer] = useState(0);
  const [productDetailToBillDetail, setProductDetailToBillDetail] = useState([]);

  // Modal States
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [modalActionState, setModalActionState] = useState({
    visible: false,
    type: "", // 'CANCEL', 'NEXT', 'ROLLBACK'
    title: "",
    okText: "",
    danger: false
  });

  const loadData = useCallback(() => {
    if (!id) return;

    // 1. Lấy chi tiết hóa đơn
    BillApi.getDetailBill(id)
      .then((res) => {
        const data = res.data.data;
        if (!data) return;

        // Dispatch vào Redux
        dispatch(getBill(data));
        setShipFeeCustomer(data.moneyShip || 0);

        // --- XỬ LÝ TRẠNG THÁI (Logic quan trọng nhất) ---
        // Chấp nhận cả 2 tên biến từ Backend
        const statusFromAPI = data.billStatus || data.statusBill;
        console.log("Status API trả về:", statusFromAPI);

        // Tìm vị trí trong mảng cấu hình (listStatus)
        let index = listStatus.findIndex((item) => item.status === statusFromAPI);

        // Xử lý các trường hợp đặc biệt không nằm theo thứ tự 0-6
        if (statusFromAPI === "TRA_HANG") index = 7;
        if (statusFromAPI === "DA_HUY") index = 8;

        // Cập nhật thanh trạng thái (Steps)
        if (index !== -1) {
          dispatch(addStatusPresent(index));
        }
      })
      .catch((err) => {
        console.error("Lỗi lấy chi tiết hóa đơn:", err);
      });

    // 2. Lấy lịch sử hóa đơn
    BillApi.getAllHistoryInBillByIdBill(id).then((res) => {
      dispatch(getBillHistory(res.data.data));
    });

    // 3. Lấy phương thức thanh toán
    PaymentsMethodApi.findByIdBill(id).then((res) => {
      if (res.data && res.data.data) {
        // Kiểm tra xem có thanh toán trả sau không để hiển thị nút xác nhận
        setPayMentNo(res.data.data.some((item) => item.status === "TRA_SAU"));
        dispatch(getPaymentsMethod(res.data.data));
      }
    });


    BillApi.BillGiveBack(id).then((res) => {
      setProductDetailToBillDetail(res.data.data);
    });

  }, [id, dispatch, listStatus]);
  useEffect(() => {
    loadData();

  }, [id, changeQuanTiTy]);

  const propDataBillDetail = useMemo(() => {
    return { idBill: id, status: bill.statusBill || bill.billStatus };
  }, [id, bill.statusBill, bill.billStatus]);

  useEffect(() => {
    const total = productDetailToBillDetail.reduce((acc, cur) => {
      const price = cur.promotion
        ? (cur.price * (100 - cur.promotion)) / 100
        : cur.price;
      return acc + (price * cur.quantity);
    }, 0);

    const newShipFee = total >= 2000000 ? 0 : (bill.moneyShip || 0);

    // Chỉ update nếu có sự thay đổi để tránh loop
    if (shipFeeCustomer !== newShipFee) {
      setShipFeeCustomer(newShipFee);
      logApiCall("UpdateShipBill");
      BillApi.UpdateShipBill({ ship: newShipFee, idBill: id }).catch(console.error);

    }
  }, [productDetailToBillDetail, bill.moneyShip]);


  // PDF Logic
  const generatePDF = useReactToPrint({
    content: () => document.getElementById("pdfContent"),
    documentTitle: `Bill-${bill.code}`,
  });

  // Common Handler for Status Change
  const handleModalAction = () => {
    form.validateFields().then(async (values) => {
      const payload = {
        actionDescription: values.actionDescription,
        newStatus: targetStatus,
      };

      console.log("Dữ liệu gửi đi:", payload);

      try {
        // Gọi API duy nhất
        await BillApi.changeStatusBill(id, payload);

        message.success("Thao tác thành công!");
        setModalActionState({ ...modalActionState, visible: false });

        // Reload lại dữ liệu
        loadData();
      } catch (error) {
        console.error(error);
        message.error(error.response?.data?.message || "Có lỗi xảy ra khi đổi trạng thái");
      }
    });
  };

  const openModal = (type) => {
    form.resetFields();
    let config = {};
    let nextStatus = "";

    if (type === "CANCEL") {
      config = { title: "Hủy đơn hàng", okText: "Hủy đơn", danger: true };
      nextStatus = "DA_HUY"; // Index 8
    }
    else if (type === "NEXT") {
      config = { title: "Chuyển trạng thái tiếp theo", okText: "Đồng ý", danger: false };
      // Tìm trạng thái có index = index hiện tại + 1
      const nextStep = listStatus.find(s => s.id === statusPresent + 1);
      nextStatus = nextStep ? nextStep.status : "";
    }
    else if (type === "ROLLBACK") {
      config = { title: "Quay lại trạng thái trước", okText: "Quay lại", danger: false };
      // Tìm trạng thái có index = index hiện tại - 1
      const prevStep = listStatus.find(s => s.id === statusPresent - 1);
      nextStatus = prevStep ? prevStep.status : "";
    }

    setTargetStatus(nextStatus); // Lưu lại để dùng khi bấm OK
    setModalActionState({ visible: true, type, ...config });
  };

  const closeModal = () => {
    setModalActionState({ ...modalActionState, visible: false });
    setStatusBill({ ...statusBill, actionDescription: "" });
    form.resetFields();
  };

  const handlePaymentConfirm = () => {
    Modal.confirm({
      title: "Xác nhận thanh toán",
      content: "Bạn có chắc chắn xác nhận thanh toán cho các khoản trả sau?",
      onOk: async () => {
        try {
          const ids = paymentsMethod.map(item => item.id);
          await PaymentsMethodApi.updateStatus(id, ids);
          message.success("Xác nhận thanh toán thành công");
          loadData(); // Reload all data
        } catch (error) {
          message.error("Lỗi thanh toán");
        }
      }
    });
  };


  const columnsHistory = [
    { title: "STT", dataIndex: "stt", key: "stt", width: 60, align: 'center' },
    {
      title: "Trạng thái",
      dataIndex: "statusBill",
      key: "statusBill",
      render: (status) => <Tag color={status === 'DA_HUY' ? 'red' : 'blue'}>{getStatusLabel(status)}</Tag>
    },
    {
      title: "Ngày tạo",
      dataIndex: "createDate",
      key: "createDate",
      render: (text) => moment(text).format("HH:mm:ss DD-MM-YYYY")
    },
    { title: "Người xác nhận", dataIndex: "fullName", key: "fullName" },
    { title: "Ghi chú", dataIndex: "actionDesc", key: "actionDesc" },
  ];

  const columnsPayments = [
    { title: "STT", key: "index", render: (_, __, index) => index + 1, width: 50 },
    { title: "Mã GD", dataIndex: "vnp_Transaction", key: "vnp_Transaction" },
    {
      title: "Số tiền",
      dataIndex: "totalMoney",
      key: "totalMoney",
      render: (val) => <b style={{ color: 'red' }}>{formatCurrency(val)}</b>
    },
    {
      title: "Phương thức",
      dataIndex: "method",
      key: "method",
      render: (method) => <Tag color="cyan">{getPaymentMethodLabel(method)}</Tag>
    },
    {
      title: "Loại GD",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = status === 'THANH_TOAN' ? 'green' : (status === 'TRA_SAU' ? 'gold' : 'default');
        let text = status === 'THANH_TOAN' ? 'Thanh toán' : (status === 'TRA_SAU' ? 'Trả sau' : 'Hoàn tiền');
        return <Tag color={color}>{text}</Tag>
      }
    },
    {
      title: "Thời gian",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) => moment(text).format("DD-MM-YYYY HH:mm")
    },
    { title: "Người xác nhận", dataIndex: "employees", key: "employees", render: (emp) => emp?.user?.fullName || "Hệ thống" },
    { title: "Ghi chú", dataIndex: "description", key: "description" },
  ];



  return (
    <div style={{ backgroundColor: "#f0f2f5", padding: "20px", minHeight: "100vh" }}>
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between" }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>Đơn hàng #{bill.code}</Title>
          <Text type="secondary">Ngày tạo: {moment(bill.createdAt).format("DD/MM/YYYY HH:mm")}</Text>
        </div>
        <Button icon={<HistoryOutlined />} onClick={() => setIsHistoryModalOpen(true)}>Lịch sử</Button>
      </div>

      {/* Grid System */}
      <Row gutter={24}>

        {/* CỘT TRÁI: TIẾN ĐỘ */}
        <Col span={16}>
          <Card title="Tiến độ" style={{ marginBottom: "20px" }}>
            <TimeLine listStatus={listStatus} data={billHistory} statusPresent={statusPresent} />
          </Card>
        </Col>

        {/* CỘT PHẢI: TRẠNG THÁI & KHÁCH HÀNG */}
        <Col span={8}>
          {/* CỘT PHẢI: TRẠNG THÁI & KHÁCH HÀNG */}
          <Card style={{ marginBottom: "20px", borderTop: "4px solid #1890ff" }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <Text type="secondary">Trạng thái hiện tại</Text><br />
              <Tag color="blue" style={{ fontSize: 16, marginTop: 5, padding: "5px 15px" }}>
                {getStatusLabel(bill.statusBill || bill.billStatus)}
              </Tag>
            </div>

            <Row gutter={[10, 10]}>
              {/* NÚT CHUYỂN TRẠNG THÁI TIẾP THEO */}
              {/* Chỉ hiện khi chưa hoàn thành (index < 6) và không phải Đã hủy/Trả hàng */}
              {statusPresent < 6 && bill.statusBill !== "DA_HUY" && bill.statusBill !== "TRA_HANG" && (
                <Col span={24}>
                  <Button
                    type="primary"
                    block
                    size="large"
                    icon={<CheckCircleOutlined />}
                    onClick={() => openModal('NEXT')}
                  >
                    {/* Logic hiển thị tên trạng thái tiếp theo */}
                    {(() => {
                      const nextStep = listStatus.find(s => s.id === statusPresent + 1);
                      return nextStep ? `Chuyển sang: ${nextStep.name}` : "Chuyển trạng thái tiếp theo";
                    })()}
                  </Button>
                </Col>
              )}

              {/* NÚT HỦY ĐƠN */}
              {/* Chỉ cho hủy khi trạng thái < 4 (trước khi vận chuyển) và chưa hủy */}
              {statusPresent < 4 && bill.statusBill !== "DA_HUY" && bill.statusBill !== "TRA_HANG" && (
                <Col span={24}>
                  <Button
                    danger
                    block
                    icon={<CloseCircleOutlined />}
                    onClick={() => openModal('CANCEL')}
                  >
                    Hủy đơn hàng
                  </Button>
                </Col>
              )}

              {/* NÚT QUAY LẠI (ROLLBACK) - Tùy chọn nếu bạn muốn giữ */}
              {statusPresent > 1 && statusPresent < 6 && bill.statusBill !== "DA_HUY" && (
                <Col span={24}>
                  <Button block icon={<RollbackOutlined />} onClick={() => openModal('ROLLBACK')}>
                    Quay lại trạng thái trước
                  </Button>
                </Col>
              )}
            </Row>
          </Card>

          <Card title="Khách hàng" size="small">
            <Space direction="vertical">
              <div><UserOutlined /> {bill.userName || "Khách lẻ"}</div>
              <div><PhoneOutlined /> {bill.phoneNumber || "---"}</div>
              <div><EnvironmentOutlined /> {bill.address || "Tại quầy"}</div>
            </Space>
          </Card>
        </Col>

        <Col span={24}>
          <Card title={<span><FileTextOutlined /> Chi tiết sản phẩm</span>}>
            <TabBillDetail dataBillDetail={propDataBillDetail} />

            <Divider />
            <Row justify="end">
              <Col span={12}>
                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label="Tổng tiền hàng">{formatCurrency(bill.totalMoney)}</Descriptions.Item>
                  <Descriptions.Item label="Phí vận chuyển">{formatCurrency(shipFeeCustomer)}</Descriptions.Item>
                  <Descriptions.Item label="Tổng thanh toán">
                    <b style={{ color: "#1890ff", fontSize: 18 }}>
                      {formatCurrency((bill.totalMoney || 0) + (bill.moneyShip || 0))}
                    </b>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </Card>
        </Col>

      </Row>

      {/* Modals */}
      <Modal title={modalActionState.title} open={modalActionState.visible} onOk={handleModalAction} onCancel={() => setModalActionState({ ...modalActionState, visible: false })} okButtonProps={{ danger: modalActionState.danger }}>
        <Form form={form}>
          <Form.Item name="actionDescription" rules={[{ required: true, message: "Nhập ghi chú!" }]}>
            <TextArea rows={4} placeholder="Nhập ghi chú..." />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Lịch sử đơn hàng" open={isHistoryModalOpen} onCancel={() => setIsHistoryModalOpen(false)} footer={null} width={800}>
        <Table dataSource={billHistory} columns={columnsHistory} rowKey="id" pagination={false} />
      </Modal>
    </div>
  );
}

export default DetailBill;