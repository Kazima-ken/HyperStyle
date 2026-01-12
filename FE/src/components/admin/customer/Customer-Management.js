import React, { useEffect, useState } from "react";
import {
    Input,
    Button,
    Select,
    Table,
    Row,
    Col,
    Modal,
    Tooltip,
    Radio,
    Card,
    Space,
    Tag,
    Avatar,
    Typography,
    DatePicker,
    List,
    Empty,
    Badge
} from "antd";
import {
    SearchOutlined,
    ReloadOutlined,
    UserAddOutlined,
    EditOutlined,
    EyeOutlined,
    EnvironmentOutlined,
    PlusOutlined,
    CheckCircleFilled,
    PhoneOutlined,
    UserOutlined
} from "@ant-design/icons";
import "react-toastify/dist/ReactToastify.css";
// import "./style-customer.css"; // Bạn có thể bỏ file css cũ hoặc sửa lại theo css mới bên dưới
import { CustomerApi } from "../../../api/admin/account/customerApi";
import { AddressApi } from "../../../api/admin/address/addressApi";
import { useAppDispatch, useAppSelector } from "../../../app/Hook";
import { Link } from "react-router-dom";
import {
    GetCustomer,
    SetCustomer,
} from "../../../app/reducer/CustomerReducer";
import ModalCreateAddress from "./modal/ModalCreateAddress";
import moment from "moment/moment";
import { BsFillPersonVcardFill, BsPersonCircle } from "react-icons/bs";

const { Option } = Select;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const CustomerManagement = () => {
    // --- STATE & LOGIC (GIỮ NGUYÊN) ---
    const [initialCustomerList, setInitialCustomerList] = useState([]);
    const [listaccount, setListaccount] = useState([]);
    const [initialStartDate, setInitialStartDate] = useState(null);
    const [initialEndDate, setInitialEndDate] = useState(null);
    const dispatch = useAppDispatch();
    const [ageRange, setAgeRange] = useState([0, 100]);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleUpdate, setModalVisibleUpdate] = useState(false);
    const [modalVisibleDetail, setModalVisibleDetail] = useState(false);
    const [isModalAddressOpen, setIsModalAddressOpen] = useState(false);
    const [modalVisibleAddAddress, setModalVisibleAddAddress] = useState(false);
    const [modalVisibleUpdateAddress, setModalVisibleUpdateAddress] = useState(false);
    const [addressId, setAddressId] = useState("");
    const [customerId, setCustomerId] = useState("");
    const [listAddress, setListAddress] = useState([]);
    const [idUpdate, setIdUpdate] = useState("");
    const [idDetail, setIdDetail] = useState("");
    const [searchCustomer, setSearchCustomer] = useState({
        keyword: "",
        status: "",
    });
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [clickRadio, setClickRadio] = useState("");

    const changeRadio = (index) => {
        setClickRadio(index);
    };

    const data = useAppSelector(GetCustomer);
    useEffect(() => {
        if (data != null) {
            setListaccount(data);
        }
    }, [data]);

    const handleInputChangeSearch = (name, value) => {
        setSearchCustomer((prevSearchCustomer) => ({
            ...prevSearchCustomer,
            [name]: value,
        }));
    };

    const handleKeywordChange = (event) => {
        const { value } = event.target;
        handleInputChangeSearch("keyword", value);
    };

    const handleStatusChange = (value) => {
        handleInputChangeSearch("status", value);
    };

    const handleCancel = () => {
        setModalVisible(false);
        setModalVisibleAddAddress(false);
        setModalVisibleUpdateAddress(false);
        setModalVisibleUpdate(false);
        setModalVisibleDetail(false);
    };

    useEffect(() => {
        const { keyword, status } = searchCustomer;
        CustomerApi.getAll({ status }).then((res) => {
            const data = res.data?.data || [];
            const filteredCustomers = data
                .filter((customer) => {
                    const fullName = customer.fullName || "";
                    const phoneNumber = customer.phoneNumber || "";
                    const toKeyword = keyword.toLowerCase();
                    return (
                        fullName.toLowerCase().includes(toKeyword) ||
                        phoneNumber.includes(keyword)
                    );
                })
                .map((customer, index) => ({
                    ...customer,
                    stt: index + 1,
                }));
            setListaccount(filteredCustomers);
            dispatch(SetCustomer(filteredCustomers));
        });
    }, [searchCustomer.status, searchCustomer.keyword]); // Thêm keyword vào dep để search realtime nếu muốn

    const handleSubmitSearch = () => {
        // Logic search đã được xử lý ở useEffect trên hoặc giữ nguyên nút bấm
        const { keyword, status } = searchCustomer;
        CustomerApi.getAll({ status }).then((res) => {
            const filteredCustomers = res.data.data
                .filter((customer) => {
                    const toKeyword = keyword.toLowerCase();
                    const fullName = customer.fullName
                        ? customer.fullName.toLowerCase()
                        : "";
                    const phoneNumber = customer.phoneNumber
                        ? customer.phoneNumber
                        : "";
                    return (
                        fullName.includes(toKeyword) || phoneNumber.includes(keyword)
                    );
                })
                .map((customer, index) => ({
                    ...customer,
                    stt: index + 1,
                }));
            setListaccount(filteredCustomers);
            dispatch(SetCustomer(filteredCustomers));
        });
    };

    // Logic lọc ngày sinh (Thêm UI RangePicker để sử dụng logic này)
    const filterByDateOfBirthRange = (dates) => {
        if (!dates) {
            setStartDate(null);
            setEndDate(null);
            setListaccount(initialCustomerList);
            dispatch(SetCustomer(initialCustomerList));
            return;
        }
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);

        const filteredCustomers = initialCustomerList.filter((customer) => {
            const accountDateOfBirth = moment(customer.dateOfBirth).startOf("day");
            return accountDateOfBirth.isBetween(start, end, null, "[]");
        });
        setListaccount(filteredCustomers);
        dispatch(SetCustomer(filteredCustomers));
    };

    const handleClear = () => {
        setSearchCustomer({ keyword: "", status: "" });
        setStartDate(null);
        setEndDate(null);
        setListaccount(
            (initialCustomerList || []).map((customer, index) => ({
                ...customer,
                stt: index + 1,
            }))
        );
        setAgeRange([0, 100]);
    };

    const loadData = () => {
        CustomerApi.getAll().then(
            (res) => {
                const data = res.data?.data || [];
                const accounts = data.map((customer, index) => ({
                    ...customer,
                    stt: index + 1,
                }));
                setListaccount(accounts);
                setInitialCustomerList(accounts);
                dispatch(SetCustomer(accounts));
            },
            (err) => console.log(err)
        );
    };

    const handleViewUpdate = (id) => {
        setAddressId(id);
        setModalVisibleUpdateAddress(true);
        setIsModalAddressOpen(false);
    };

    const handleOpenAddAdress = () => {
        setIsModalAddressOpen(false);
        setModalVisibleAddAddress(true);
    };

    const handleViewDetail = (id) => {
        setIdDetail(id);
        setModalVisibleDetail(true);
    };

    const handleUpdate = (id) => {
        setIdUpdate(id);
        setModalVisibleUpdate(true);
    };

    const selectedAccount = (record) => {
        setIsModalAddressOpen(true);
        setCustomerId(record.id);
        AddressApi.getAllAddressByUser(record.id).then((res) => {
            setListAddress(res.data.data || []);
        });
    };

    useEffect(() => {
        loadData();
    }, []);

    // --- NEW COLUMNS CONFIGURATION ---
    const columns = [
        {
            title: "#",
            dataIndex: "stt",
            key: "stt",
            width: 50,
            align: "center",
        },
        {
            title: "Khách hàng",
            key: "info",
            width: 250,
            render: (_, record) => (
                <Space>
                    <Avatar
                        size={48}
                        src={record.avata}
                        onError={() => false}
                    >
                        <BsFillPersonVcardFill />
                    </Avatar>


                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <Text strong>{record.fullName}</Text>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                            {record.email}
                        </Text>
                    </div>
                </Space>
            ),
        },

        {
            title: "Số điện thoại",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
        },
        {
            title: "Ngày sinh",
            dataIndex: "dateOfBirth",
            key: "dateOfBirth",
            render: (date) => (date ? moment(date).format("DD/MM/YYYY") : "-"),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                let color = status === "DANG_SU_DUNG" ? "success" : "error";
                let text = status === "DANG_SU_DUNG" ? "Kích hoạt" : "Ngừng kích hoạt";
                return <Tag color={color}>{text.toUpperCase()}</Tag>;
            },
        },
        {
            title: "Thao tác",
            key: "action",
            align: "center",
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Chi tiết">
                        <Link to={`/detail-customer-management/${record.id}`}>
                            <Button type="text" icon={<EyeOutlined style={{ color: '#1890ff' }} onClick={() => handleViewDetail(record.id)} />} />
                        </Link>
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Link to={`/update-customer-management/${record.id}`}>
                            <Button type="text" icon={<EditOutlined style={{ color: '#faad14' }} onClick={() => handleUpdate(record.id)} />} />
                        </Link>
                    </Tooltip>
                    <Tooltip title="Địa chỉ">
                        <Button
                            type="text"
                            icon={<EnvironmentOutlined style={{ color: '#52c41a' }} />}
                            onClick={() => selectedAccount(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: "20px", backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
            {/* HEADER & FILTERS CARD */}
            <Card bordered={false} style={{ borderRadius: "10px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <Row gutter={[16, 16]} align="middle" justify="center">
                    <Col xs={24} md={12}>
                        <Title level={4} style={{ margin: 0 }}>
                            <Space>
                                Quản lý khách hàng
                                <Badge count={listaccount.length} overflowCount={999} style={{ backgroundColor: '#52c41a' }} />
                            </Space>
                        </Title>
                    </Col>
                    {/* <Col xs={24} md={12} style={{ textAlign: "right" }}>
                        <Link to="/create-customer-management">
                            <Button type="primary" icon={<PlusOutlined />} size="large" style={{ borderRadius: "6px" }}>
                                Thêm mới
                            </Button>
                        </Link>
                    </Col> */}
                </Row>

                <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #f0f0f0" }}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Input
                                placeholder="Tìm tên hoặc SĐT..."
                                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                                value={searchCustomer.keyword}
                                onChange={handleKeywordChange}
                                allowClear
                            />
                        </Col>
                        <Col xs={24} sm={12} md={6} lg={5}>
                            <Select
                                style={{ width: "100%" }}
                                placeholder="Chọn trạng thái"
                                value={searchCustomer.status}
                                onChange={handleStatusChange}
                            >
                                <Option value="">Tất cả trạng thái</Option>
                                <Option value="DANG_SU_DUNG">Đang sử dụng</Option>
                                <Option value="KHONG_SU_DUNG">Ngừng kích hoạt</Option>
                            </Select>
                        </Col>
                        <Col xs={24} sm={12} md={6} lg={6}>
                            <RangePicker
                                style={{ width: "100%" }}
                                placeholder={['Từ ngày sinh', 'Đến ngày sinh']}
                                onChange={filterByDateOfBirthRange}
                                value={startDate && endDate ? [moment(startDate), moment(endDate)] : null}
                                format="DD/MM/YYYY"
                            />
                        </Col>
                        <Col xs={24} sm={12} md={4} lg={4}>
                            <Button icon={<ReloadOutlined />} onClick={handleClear}>
                                Làm mới
                            </Button>
                            {/* Nút tìm kiếm có thể ẩn đi vì đã search realtime, hoặc giữ lại */}
                            {/* <Button type="primary" onClick={handleSubmitSearch} style={{ marginLeft: 8 }}>Tìm</Button> */}
                        </Col>
                    </Row>
                </div>
            </Card>

            {/* TABLE CARD */}
            <Card bordered={false} style={{ borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <Table
                    dataSource={listaccount}
                    columns={columns}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng ${total} khách hàng`
                    }}
                    rowClassName={(record, index) => (index % 2 === 0 ? "table-row-light" : "table-row-dark")}
                />
            </Card>

            {/* MODAL ADDRESS */}
            <Modal
                title={
                    <div style={{ paddingBottom: '10px', borderBottom: '1px solid #f0f0f0' }}>
                        <Title level={4} style={{ margin: 0 }}>
                            <EnvironmentOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
                            Sổ địa chỉ nhận hàng
                        </Title>
                    </div>
                }
                open={isModalAddressOpen}
                onCancel={() => setIsModalAddressOpen(false)}
                footer={[
                    <Button key="close" shape="round" onClick={() => setIsModalAddressOpen(false)}>
                        Đóng cửa sổ
                    </Button>,
                ]}
                width={750}
                centered
                bodyStyle={{ padding: '20px 24px' }}
            >
                {/* Header Action */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <Text type="secondary">{listAddress?.length || 0} địa chỉ đã lưu</Text>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleOpenAddAdress}
                        shape="round"
                        style={{ background: '#000', borderColor: '#000' }}
                    >
                        Thêm địa chỉ mới
                    </Button>
                </div>

                <div style={{ maxHeight: "500px", overflowY: "auto", overflowX: 'hidden', padding: '4px' }}>
                    {listAddress && listAddress.length > 0 ? (
                        <Row gutter={[16, 16]}>
                            {listAddress.map((item, index) => {
                                const isDefault = item.status === "DANG_SU_DUNG";
                                const isSelected = clickRadio === index;

                                return (
                                    <Col span={24} key={item.id}>
                                        <Card
                                            hoverable
                                            onClick={() => changeRadio(index)}
                                            style={{
                                                borderRadius: '12px',
                                                border: isSelected || isDefault ? '2px solid #1890ff' : '1px solid #f0f0f0',
                                                background: isSelected ? '#f0f7ff' : '#fff',
                                                transition: 'all 0.3s'
                                            }}
                                            bodyStyle={{ padding: '16px' }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <div style={{ flex: 1 }}>
                                                    <Space size="middle" style={{ marginBottom: 8 }}>
                                                        <Text strong style={{ fontSize: '16px' }}>
                                                            <UserOutlined style={{ marginRight: 8, color: '#8c8c8c' }} />
                                                            {item.fullName}
                                                        </Text>
                                                        <Tag color={isDefault ? "blue-inverse" : "default"} style={{ borderRadius: '4px' }}>
                                                            {isDefault ? "Mặc định" : "Địa chỉ phụ"}
                                                        </Tag>
                                                    </Space>

                                                    <div style={{ marginBottom: 4 }}>
                                                        <Text type="secondary">
                                                            <PhoneOutlined style={{ marginRight: 8 }} />
                                                            {item.phoneNumber}
                                                        </Text>
                                                    </div>

                                                    <div style={{ display: 'flex', marginTop: 8 }}>
                                                        <EnvironmentOutlined style={{ color: '#ff4d4f', marginTop: 4, marginRight: 8 }} />
                                                        <Text style={{ color: '#595959' }}>{item.address}</Text>
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                                    {isSelected || isDefault ? (
                                                        <CheckCircleFilled style={{ color: '#1890ff', fontSize: '20px' }} />
                                                    ) : (
                                                        <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #d9d9d9' }} />
                                                    )}

                                                    <Tooltip title="Chỉnh sửa">
                                                        <Button
                                                            type="text"
                                                            icon={<EditOutlined style={{ color: '#1890ff' }} />}
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // Ngăn sự kiện click vào Card
                                                                handleViewUpdate(item.id);
                                                            }}
                                                        >
                                                            Sửa
                                                        </Button>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        </Card>
                                    </Col>
                                );
                            })}
                        </Row>
                    ) : (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={<Text type="secondary">Bạn chưa lưu địa chỉ nào</Text>}
                        />
                    )}
                </div>
            </Modal>
            <ModalCreateAddress
                visible={modalVisibleAddAddress}
                onCancel={handleCancel}
                id={customerId}
            />
        </div>
    );
};

export default CustomerManagement;