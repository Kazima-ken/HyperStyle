import {
  EyeOutlined,
  UserSwitchOutlined,
  CheckCircleOutlined,
  FilePdfOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Empty,
  Modal,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useReactToPrint } from "react-to-print";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { BillApi } from "../../../api/admin/bill/billApi";
import ModalAccountEmployee from "./modal/ModalAccountEmployee";
import "./style-tab-bills.css"; // File CSS mới

const { Text } = Typography;

function TabBills({ statusBill, dataFillter, addNotify }) {
  const [dataBill, setDataBill] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // Thay thế dataIdCheck
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // WebSocket Setup
  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = Stomp.over(socket);
    stompClient.debug = null; // Tắt log debug của stomp để sạch console

    stompClient.connect({}, () => {
      stompClient.subscribe("/app/admin-notifications", () => {
        fetchData(); // Reload data khi có thông báo socket
      });
    });

    return () => {
      if (stompClient.connected) stompClient.disconnect();
    };
  }, [statusBill, dataFillter]);

  // Fetch Data Wrapper
  const fetchData = () => {
    setLoading(true);
    const params = { ...dataFillter, status: statusBill ? [statusBill] : [] };

    // Logic xử lý status rỗng giống code cũ
    if (!statusBill) {
      params.status = [
        "CHO_XAC_NHAN", "XAC_NHAN", "CHO_VAN_CHUYEN",
        "VAN_CHUYEN", "DA_THANH_TOAN", "THANH_CONG",
        "TRA_HANG", "DA_HUY"
      ];
    }

    BillApi.getAll(params)
      .then((res) => {
        setDataBill(res.data.data);
        if (statusBill) {
          addNotify({ status: statusBill, quantity: res.data.data.length });
        }
      })
      .catch((error) => {
        // Handle error silently or toast
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    setSelectedRowKeys([]); // Reset selection khi đổi tab/filter
  }, [statusBill, dataFillter]);

  // Format Helpers
  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

  // Columns Definition
  const columns = [
    {
      title: "#",
      dataIndex: "stt",
      key: "stt",
      width: 50,
      align: "center",
      render: (text, record, index) => <span style={{ color: '#888' }}>{index + 1}</span>
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "code",
      key: "code",
      render: (text) => (
        <span style={{ fontWeight: "bold", color: "#1890ff" }}>{text}</span>
      ),
    },
    {
      title: "Khách hàng",
      dataIndex: "userName",
      key: "userName",
      render: (text) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#fde3cf', color: '#f56a00' }} size="small" />
          <Text strong>{text || "Khách lẻ"}</Text>
        </Space>
      ),
    },
    {
      title: "Nhân viên phụ trách",
      dataIndex: "nameEmployees",
      key: "nameEmployees",
      render: (text) => text ? <Tag color="blue">{text}</Tag> : <Tag>Chưa gán</Tag>,
    },
    {
      title: "Thời gian",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Text style={{ fontSize: '13px' }}>{moment(text).format("HH:mm")}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>{moment(text).format("DD-MM-YYYY")}</Text>
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalMoney",
      key: "totalMoney",
      align: "right",
      render: (text) => (
        <Text type="danger" style={{ fontWeight: "bold" }}>
          {formatCurrency(text)}
        </Text>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 60,
      render: (_, record) => (
        <Tooltip title="Xem chi tiết">
          <Link to={`/bill-management/detail-bill/${record.id}`}>
            <Button type="text" shape="circle" icon={<EyeOutlined style={{ color: '#1890ff' }} />} />
          </Link>
        </Tooltip>
      ),
    },
  ];

  // Logic Select Row
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // Logic Next Status (Giữ nguyên logic cũ)
  const nextStatusBill = () => {
    const mapNext = {
      "CHO_XAC_NHAN": "XAC_NHAN",
      "XAC_NHAN": "CHO_VAN_CHUYEN",
      "CHO_VAN_CHUYEN": "VAN_CHUYEN",
      "VAN_CHUYEN": "DA_THANH_TOAN",
      "DA_THANH_TOAN": "THANH_CONG",
    };
    return mapNext[statusBill] || "HUY";
  };

  const convertString = (key) => {
    // ... (Giữ nguyên logic text cũ của bạn hoặc cải tiến map object)
    const mapName = {
      "CHO_XAC_NHAN": "Xác nhận đơn",
      "XAC_NHAN": "Gửi vận chuyển",
      "CHO_VAN_CHUYEN": "Đã giao cho bưu tá",
      "VAN_CHUYEN": "Xác nhận thanh toán",
      "DA_THANH_TOAN": "Hoàn thành đơn",
    }
    return mapName[key] || "Hủy đơn";
  };

  // PDF Printing
  const generatePDF = useReactToPrint({
    content: () => document.getElementById("pdfContent"),
    documentTitle: "Hoa_don",
  });

  // Action Handlers
  const handleChangeStatus = () => {
    Modal.confirm({
      title: "Xác nhận thay đổi trạng thái",
      icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
      content: (
        <div>
          <p>Bạn có chắc chắn muốn <b>{convertString(statusBill)}</b> cho {selectedRowKeys.length} đơn hàng đã chọn?</p>
          <TextArea rows={3} placeholder="Nhập ghi chú (bắt buộc > 10 ký tự)..." id="noteArea" />
        </div>
      ),
      okText: "Xác nhận",
      cancelText: "Đóng",
      onOk: async () => {
        const note = document.getElementById("noteArea").value;
        if (!note || note.trim().length < 10) {
          message.warning("Vui lòng nhập ghi chú (tối thiểu 10 ký tự)!");
          return Promise.reject(); // Prevent modal closing
        }

        const data = {
          ids: selectedRowKeys,
          status: nextStatusBill(),
          note: note,
        };

        // Logic in PDF cũ
        if (statusBill === "XAC_NHAN") {
          try {
            const resPdf = await BillApi.getAllFilePdfByIdBill(data);
            document.getElementById("pdfContent").innerHTML = resPdf.data.data;
            generatePDF();
          } catch (e) { console.error(e) }
        }

        try {
          const response = await BillApi.changeStatusAllBillByIds(data);
          if (response.data.data) {
            message.success("Thao tác thành công!");
            setSelectedRowKeys([]);
            fetchData();
          }
        } catch (error) {
          message.error(error.response?.data?.message || "Có lỗi xảy ra");
        }
      },
    });
  };

  const showModalEmployee = () => setIsModalOpen(true);
  const handleModalClose = () => {
    setIsModalOpen(false);
    fetchData();
  };

  // Render Check cho Bulk Action Bar
  const hasSelected = selectedRowKeys.length > 0;
  const showActions = statusBill && statusBill !== "DA_HUY" && statusBill !== "THANH_CONG";

  return (
    <div className="tab-bills-container">
      {/* TABLE */}
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataBill}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} đơn hàng`
        }}
        locale={{ emptyText: <Empty description="Không có dữ liệu" /> }}
        className="custom-table"
      />

      {/* BULK ACTION BAR - Floating Footer */}
      <div className={`bulk-action-bar ${hasSelected && showActions ? "visible" : ""}`}>
        <div className="selected-count">
          <span>Đang chọn: <b>{selectedRowKeys.length}</b> đơn hàng</span>
          <Button type="link" onClick={() => setSelectedRowKeys([])} size="small">Bỏ chọn</Button>
        </div>

        <Space size="middle">
          <Button
            className="btn-action-status"
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={handleChangeStatus}
            size="large"
          >
            {convertString(statusBill)}
          </Button>

          <Button
            className="btn-action-employee"
            icon={<UserSwitchOutlined />}
            onClick={showModalEmployee}
            size="large"
          >
            Chuyển nhân viên
          </Button>
        </Space>
      </div>

      {/* MODAL & HIDDEN ELEMENTS */}
      <Modal
        title={<span><UserSwitchOutlined /> Chuyển nhân viên phụ trách</span>}
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
        width={800}
        destroyOnClose
      >
        <ModalAccountEmployee
          dataIdCheck={selectedRowKeys}
          handleCancel={handleModalClose}
          status={true}
        />
      </Modal>

      <div style={{ display: "none" }}>
        <div id="pdfContent" />
      </div>
    </div>
  );
}

export default TabBills;