import {
    FilterOutlined,
    PlusOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CarOutlined,
    CloseCircleOutlined,
    ShoppingOutlined,
} from "@ant-design/icons";
import { Badge, Button, Card, Col, Drawer, Input, Row, Statistic, Tabs, Typography, Space, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BillApi } from "../../../api/admin/bill/billApi";
import { useAppDispatch } from "../../../app/Hook";
import { getAllBill } from "../../../app/reducer/BillReducer";
import FormSearch from "./FormSearch";
import TabBills from "./TabBills";
import "./style-bill-modern.css"; // File CSS mới

const { Title, Text } = Typography;
const { Search } = Input;

function BillAdmin() {
    const users = useSelector((state) => state.bill.search.users);
    const employees = useSelector((state) => state.bill.search.employees);
    const dispatch = useAppDispatch();

    const [status, setStatus] = useState([]);
    const [quantityNotify, setQuantityNotify] = useState([]);
    const [openFilter, setOpenFilter] = useState(false); // State mở Drawer Filter
    const [activeTab, setActiveTab] = useState("");

    // Khởi tạo filter
    const initialFilter = {
        startTimeString: "",
        endTimeString: "",
        status: [],
        endDeliveryDateString: "",
        startDeliveryDateString: "",
        key: "",
        employees: "",
        user: "",
        phoneNumber: "",
        type: "",
        page: 0,
    };

    const [fillter, setFillter] = useState(initialFilter);

    useEffect(() => {
        BillApi.getAllStatusBill().then((res) => {
            setQuantityNotify(res.data.data);
        });
    }, []);

    // --- HÀM XỬ LÝ LOGIC (Giữ nguyên logic cũ, chỉ map lại UI) ---
    const onChangeFillter = (value, fileName) => {
        setFillter({ ...fillter, [fileName]: value });
    };

    const onChangeStatusBillInFillter = (value) => {
        setStatus(value);
    };

    const handleSubmitSearch = () => {
        const data = { ...fillter };
        if (status.length !== 0) data.status = status;
        setFillter(data);
        BillApi.getAll(data).then((res) => {
            dispatch(getAllBill(res.data.data));
            setOpenFilter(false); // Đóng drawer sau khi tìm
        });
    };

    const handleQuickSearch = (value) => {
        // Tìm kiếm nhanh bằng từ khóa
        const data = { ...fillter, key: value };
        setFillter(data);
        BillApi.getAll(data).then((res) => dispatch(getAllBill(res.data.data)));
    }

    const handleSelectChange = async (value) => {
        const data = { ...fillter, status: status, type: value };
        setFillter(data);
        await BillApi.getAll(data).then((res) => dispatch(getAllBill(res.data.data)));
    };

    const handleSelectMultipleChange = (value) => {
        const arr = Object.keys(value).map((key) => value[key]);
        setStatus(arr);
        const data = { ...fillter, status: arr };
        setFillter(data);
        BillApi.getAll(data).then((res) => dispatch(getAllBill(res.data.data)));
    };

    const clearFillter = () => {
        setFillter(initialFilter);
        setStatus([]);
    };

    // --- HELPER UI ---
    const getQuantity = (key) => {
        const item = quantityNotify.find((i) => i.status === key);
        return item ? item.quantity : 0;
    };

    // Mapping màu và icon cho từng trạng thái để làm thẻ thống kê
    const statusConfig = [
        { key: "CHO_XAC_NHAN", title: "Chờ xác nhận", color: "#faad14", icon: <ClockCircleOutlined /> },
        { key: "CHO_VAN_CHUYEN", title: "Chờ vận chuyển", color: "#13c2c2", icon: <ShoppingOutlined /> },
        { key: "VAN_CHUYEN", title: "Đang giao", color: "#1890ff", icon: <CarOutlined /> },
        { key: "THANH_CONG", title: "Hoàn thành", color: "#52c41a", icon: <CheckCircleOutlined /> },
    ];

    // Danh sách tabs cho bảng
    const listStatusTab = ["", "CHO_XAC_NHAN", "XAC_NHAN", "CHO_VAN_CHUYEN", "VAN_CHUYEN", "THANH_CONG", "DA_HUY"];
    const convertString = (key) => {
        if (key === "") return "Tất cả đơn";
        return key.replace(/_/g, " ");
    };

    const addNotify = (notify) => {
        var index = quantityNotify.findIndex((item) => item.code === notify.code);
        if (index != -1) {
            var data = quantityNotify
            data.splice(index, 1, notify)
            setQuantityNotify(data);
        }
    };

    return (
        <div className="dashboard-container">
            {/* --- HEADER --- */}
            <div className="page-header">
                <div>
                    <Title level={2} style={{ margin: 0 }}>Quản lý đơn hàng</Title>
                    <Text type="secondary">Tổng quan tình hình kinh doanh hôm nay</Text>
                </div>
                <Space>
                    <Button icon={<FilterOutlined />} size="large" onClick={() => setOpenFilter(true)}>
                        Bộ lọc nâng cao
                    </Button>
                </Space>
            </div>

            {/* --- STATISTIC CARDS (ĐIỂM KHÁC BIỆT LỚN NHẤT) --- */}
            <Row gutter={[16, 16]} className="stats-row">
                {statusConfig.map((item) => (
                    <Col xs={24} sm={12} md={6} key={item.key}>
                        <Card bordered={false} className="stat-card" onClick={() => setActiveTab(item.key)} hoverable>
                            <Statistic
                                title={<span style={{ fontWeight: 600, color: "#8c8c8c" }}>{item.title}</span>}
                                value={getQuantity(item.key)}
                                valueStyle={{ color: item.color, fontWeight: "bold" }}
                                prefix={item.icon}
                                suffix="đơn"
                            />
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* --- MAIN CONTENT --- */}
            <Card bordered={false} className="main-card">
                <div className="table-toolbar">
                    <Search
                        placeholder="Tìm kiếm theo mã đơn, tên khách hàng..."
                        allowClear
                        onSearch={handleQuickSearch}
                        style={{ width: 400 }}
                        size="large"
                    />
                </div>

                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    type="line"
                    className="modern-tabs"
                    items={listStatusTab.map((item) => ({
                        label: (
                            <Space>
                                {convertString(item)}
                                {getQuantity(item) > 0 && <Badge count={getQuantity(item)} showZero color={item === "DA_HUY" ? "red" : "blue"} />}
                            </Space>
                        ),
                        key: item,
                        children: (
                            <TabBills
                                statusBill={item}
                                dataFillter={fillter}
                                quantityNotify={quantityNotify}
                                addNotify={addNotify}
                            />
                        ),
                    }))}
                />
            </Card>

            {/* --- DRAWER FILTER (ẨN BỘ LỌC ĐI) --- */}
            <Drawer
                title="Bộ lọc tìm kiếm nâng cao"
                placement="right"
                width={450}
                onClose={() => setOpenFilter(false)}
                open={openFilter}
                extra={
                    <Space>
                        <Button onClick={clearFillter}>Xóa lọc</Button>
                        <Button type="primary" onClick={handleSubmitSearch}>Áp dụng</Button>
                    </Space>
                }
            >
                <FormSearch
                    fillter={fillter}
                    changFillter={onChangeFillter}
                    users={users}
                    employess={employees}
                    onChangeStatusBillInFillter={onChangeStatusBillInFillter}
                    status={status}
                    handleSubmitSearch={handleSubmitSearch} // Logic submit form
                    handleSelectMultipleChange={handleSelectMultipleChange}
                    handleSelectChange={handleSelectChange}
                />
            </Drawer>
        </div>
    );
}

export default BillAdmin;