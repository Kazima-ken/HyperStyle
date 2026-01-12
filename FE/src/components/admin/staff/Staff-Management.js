import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  Select,
  Table,
  Row,
  Col,
  Tooltip,
  Tag,
  Avatar,
  Card,
  Space,
  Typography
} from "antd";
import "react-toastify/dist/ReactToastify.css";
import "./style-staff.css";
import { AccountApi } from "../../../api/admin/account/accountApi";
import { useAppDispatch, useAppSelector } from "../../../app/Hook";
import { GetAccount, SetAccount } from "../../../app/reducer/AccountReducer";
// import { GetAddress } from "../../../app/reducer/AddressReducer"; // Bỏ comment nếu dùng

import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPlus,
  faScrewdriverWrench,
  faFilter,
  faRotateRight
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment/moment";
import { UserOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Title } = Typography;

const StaffAdmin = () => {
  const [listAccount, setListAccount] = useState([]);
  const dispatch = useAppDispatch();

  // State tìm kiếm
  const [searchAccount, setSearchAccount] = useState({
    keyword: "",
    status: "",
  });

  // Lấy dữ liệu từ Redux (Sửa lại cách gọi selector)
  const dataAccount = useAppSelector(GetAccount);
  // const dataAddress = useAppSelector(GetAddress); // Nếu cần dùng địa chỉ

  useEffect(() => {
    if (dataAccount != null) {
      setListAccount(dataAccount);
    }
  }, [dataAccount]);

  // Hàm load dữ liệu ban đầu
  const loadData = () => {
    AccountApi.getAllStaff().then(
      (res) => {
        const accounts = res.data.data.map((account, index) => ({
          ...account,
          stt: index + 1,
        }));
        setListAccount(accounts);
        dispatch(SetAccount(accounts));
        console.log("Loaded staff accounts:", accounts);
      },
      (err) => {
        console.log(err);
      }
    );
  };

  useEffect(() => {
    loadData();
  }, []);

  // Xử lý thay đổi input tìm kiếm
  const handleInputChangeSearch = (name, value) => {
    setSearchAccount((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Nút tìm kiếm
  const handleSubmitSearch = () => {
    const { keyword, status } = searchAccount;

    AccountApi.getAllStaff({ status }).then((res) => {
      let filteredAccounts = res.data.data || [];

      if (keyword) {
        const lowerKeyword = keyword.toLowerCase();
        filteredAccounts = filteredAccounts.filter(acc =>
          (acc.fullName && acc.fullName.toLowerCase().includes(lowerKeyword)) ||
          (acc.phoneNumber && acc.phoneNumber.includes(lowerKeyword))
        );
      }

      // Đánh lại số thứ tự
      const dataWithStt = filteredAccounts.map((item, index) => ({
        ...item,
        stt: index + 1
      }));

      setListAccount(dataWithStt);
      dispatch(SetAccount(dataWithStt));
    });
  };

  // Nút làm mới
  const handleClear = () => {
    setSearchAccount({
      keyword: "",
      status: "",
    });
    loadData();
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: "5%",
      align: "center",
    },
    {
      title: "Ảnh",
      dataIndex: "avata",
      key: "avata",
      align: "center",
      render: (avata) => (
        <Avatar
          shape="square"
          size={64}
          src={avata}
          icon={<UserOutlined />}
          style={{ borderRadius: "10px" }}
        />
      ),
    },
    {
      title: "Tên nhân viên",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "CCCD",
      dataIndex: "citizenIdentity",
      key: "citizenIdentity",
    },
    {
      title: "Ngày sinh",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      render: (date) => date ? moment(date).format("DD/MM/YYYY") : "N/A",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => (gender ? "Nam" : "Nữ"),
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => {
        const isActive = status === "DANG_SU_DUNG";
        return (
          <Tag color={isActive ? "success" : "error"} style={{ padding: "5px 10px", fontSize: "14px" }}>
            {isActive ? "Kích hoạt" : "Ngừng kích hoạt"}
          </Tag>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Chi tiết">
            <Link to={`/detail-staff-management/${record.id}`}>
              <Button type="primary" icon={<FontAwesomeIcon icon={faEye} />} />
            </Link>
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Link to={`/update-staff-management/${record.id}`}>
              <Button
                type="primary"
                style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                icon={<FontAwesomeIcon icon={faScrewdriverWrench} />}
              />
            </Link>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="staff-admin-container">
      <div className="header-title">
        <Title level={3} style={{ margin: 0 }}>Quản lý nhân viên</Title>
      </div>

      <Card className="filter-card" title={<span><FontAwesomeIcon icon={faFilter} /> Bộ lọc</span>}>
        <Row gutter={[20, 20]} align="middle">
          <Col xs={24} sm={12} md={8} lg={8}>
            <label className="filter-label">Tìm kiếm:</label>
            <Input
              placeholder="Tìm theo tên hoặc SĐT..."
              value={searchAccount.keyword}
              onChange={(e) => handleInputChangeSearch("keyword", e.target.value)}
              onPressEnter={handleSubmitSearch}
              allowClear
            />
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <label className="filter-label">Trạng thái:</label>
            <Select
              style={{ width: "100%" }}
              value={searchAccount.status}
              onChange={(value) => handleInputChangeSearch("status", value)}
              placeholder="Chọn trạng thái"
            >
              <Option value="">Tất cả</Option>
              <Option value="DANG_SU_DUNG">Kích hoạt</Option>
              <Option value="KHONG_SU_DUNG">Ngừng kích hoạt</Option>
            </Select>
          </Col>

          <Col xs={24} sm={24} md={8} lg={10} style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Button type="primary" onClick={handleSubmitSearch} icon={<FontAwesomeIcon icon={faFilter} />}>
              Tìm kiếm
            </Button>
            <Button onClick={handleClear} icon={<FontAwesomeIcon icon={faRotateRight} />}>
              Làm mới
            </Button>
          </Col>
        </Row>
      </Card>

      <div className="table-container">
        <div className="table-header">
          <span className="table-title">Danh sách nhân viên</span>
          <Link to="/create-staff-management">
            <Button type="primary" icon={<FontAwesomeIcon icon={faPlus} />}>
              Thêm nhân viên
            </Button>
          </Link>
        </div>

        <Table
          dataSource={listAccount}
          rowKey="id"
          columns={columns}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          bordered
          className="staff-table"
        />
      </div>
    </div>
  );
};

export default StaffAdmin;