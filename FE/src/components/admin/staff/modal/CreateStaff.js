import React, { useState, useEffect } from "react";
import {
  Modal,
  Input,
  Select,
  Button,
  Form,
  Row,
  Col,
  Upload,
  message,
  Radio,
  Space,
  Card,
  DatePicker,
  Typography,
} from "antd";
import {
  ArrowLeftOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
  SaveOutlined,
  UserOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useAppDispatch } from "../../../../app/Hook";
import { useNavigate } from "react-router";
import dayjs from 'dayjs';

// API Imports
import { AccountApi } from "../../../../api/admin/account/accountApi";
import { AddressApi } from "../../../../api/admin/address/addressApi";
import "../style-staff.css";
import { CreateAccount } from "../../../../app/reducer/AccountReducer";

const { Option } = Select;
const { Title } = Typography; // Correct import for Title
const { TextArea } = Input;

const CreateStaff = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  // const dispatch = useAppDispatch(); // Uncomment if needed

  // --- Location State ---
  const [listProvince, setListProvince] = useState([]);
  const [listDistricts, setListDistricts] = useState([]);
  const [listWard, setListWard] = useState([]);

  // --- Upload State ---
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);

  // --- Initial Load ---
  useEffect(() => {
    loadDataProvince();
    // Set default status
    form.setFieldsValue({ status: "DANG_SU_DUNG", gender: true });
  }, []);

  // --- Address Handlers ---
  const loadDataProvince = () => {
    AddressApi.getAllProvince().then((res) => {
      setListProvince(res.data.data);
    });
  };

  const handleProvinceChange = (value) => {
    form.setFieldsValue({ districtId: undefined, wardCode: undefined });
    setListDistricts([]);
    setListWard([]);
    AddressApi.getAllProvinceDistricts(value).then((res) => {
      setListDistricts(res.data.data);
    });
  };

  const handleDistrictChange = (value) => {
    form.setFieldsValue({ wardCode: undefined });
    setListWard([]);
    AddressApi.getAllProvinceWard(value).then((res) => {
      setListWard(res.data.data);
    });
  };

  // --- Image Upload Handlers ---
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Bạn chỉ có thể tải lên tệp JPG/PNG!");
      return Upload.LIST_IGNORE;
    }
    return false;
  };


  const validateAge = (_, value) => {
    if (!value) return Promise.resolve();

    const birthDate = dayjs(value).startOf('day');
    const today = dayjs().startOf('day');

    const age = today.diff(birthDate, 'year');

    if (age < 18) {
      return Promise.reject(new Error("Nhân viên phải đủ 18 tuổi"));
    }
    return Promise.resolve();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (fileList.length === 0) {
        message.error("Vui lòng chọn ảnh đại diện");
        return;
      }

      const formData = new FormData();

      // --- 1. STAFF (Khớp với CreateStaffRequest) ---
      formData.append("staff.fullName", values.fullName);
      formData.append("staff.email", values.email);
      formData.append("staff.phoneNumber", values.phoneNumber);
      formData.append("staff.gender", values.gender);
      formData.append("staff.dateOfBirth", values.dateOfBirth.format("YYYY-MM-DD"));
      formData.append("staff.status", values.status);
      formData.append("staff.citizenIdentity", values.citizenIdentity);

      // --- 2. ADDRESS (Khớp với CreateAddressRequest) ---
      formData.append("address.line", values.line);
      formData.append("address.provinceId", values.provinceId);
      formData.append("address.DistrictId", values.districtId);
      formData.append("address.wardCode", values.wardCode);
      formData.append("address.fullName", values.fullName);
      formData.append("address.phoneNumber", values.phoneNumber);
      formData.append("address.province", values.ProvinceName);
      formData.append("address.district", values.DistrictName);
      formData.append("address.ward", values.WardName);

      formData.append("account.email", values.email);
      if (values.password) {
        formData.append("account.password", values.password);
      }
      formData.append("account.roles", "ROLE_EMLOYEE");
      formData.append("account.numberPhone", values.phoneNumber);

      // --- 4. AVATAR (Khớp với @RequestPart avatar) ---
      const file = fileList[0];
      if (file.originFileObj) {
        // QUAN TRỌNG: Key phải là "avatar" (theo tên biến trong Controller)
        formData.append("avatar", file.originFileObj);
      }

      await AccountApi.create(formData);
      message.success("Tạo nhân viên thành công");
      navigate("/staff-management");
    } catch (err) {
      console.error(err);
      // Hiển thị lỗi chi tiết từ backend trả về
      if (err.response && err.response.data) {
        // Nếu backend trả về lỗi validation dạng list
        console.log(err.response.data);
        message.error("Lỗi dữ liệu: " + JSON.stringify(err.response.data));
      } else {
        message.error("Có lỗi xảy ra");
      }
    }
  };
  return (
    <div style={{ padding: "24px", background: "#f5f7fa", minHeight: "100vh" }}>
      {/* HEADER */}
      <div style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/staff-management")} shape="circle" />
          <Title level={3} style={{ margin: 0 }}>
            Thêm Nhân Viên
          </Title>
        </Space>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleOk}
          size="large"
          style={{ borderRadius: 8 }}
        >
          Lưu thay đổi
        </Button>
      </div>

      <Form form={form} layout="vertical">
        <Row gutter={[24, 24]}>
          {/* LEFT COLUMN: AVATAR */}
          <Col xs={24} md={8} lg={6}>
            <Card
              bordered={false}
              style={{ textAlign: "center", borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Title level={5}>Ảnh đại diện</Title>
                <Upload
                  listType="picture-circle"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  beforeUpload={beforeUpload}
                  maxCount={1}
                >
                  {fileList.length < 1 && (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Tải ảnh</div>
                    </div>
                  )}
                </Upload>
              </div>
            </Card>

            {/* Account Status Card moved here for balance */}
            <Card title="Cài đặt tài khoản" bordered={false} style={{ marginTop: 24, borderRadius: 16 }}>
              <Form.Item label="Trạng thái" name="status">
                <Select>
                  <Option value="DANG_SU_DUNG">Kích hoạt</Option>
                  <Option value="KHONG_SU_DUNG">Ngừng kích hoạt</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: "Nhập mật khẩu" }, { min: 6, message: "Mật khẩu tối thiểu 6 ký tự" }]}>
                <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" />
              </Form.Item>
            </Card>
          </Col>

          {/* RIGHT COLUMN: INFO */}
          <Col xs={24} md={16} lg={18}>
            {/* Personal Info */}
            <Card title="Thông tin cá nhân" bordered={false} style={{ borderRadius: 16, marginBottom: 24 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Họ và tên"
                    name="fullName"
                    rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Vui lòng nhập email" },
                      { type: "email", message: "Email không hợp lệ" },
                    ]}
                  >
                    <Input prefix={<MailOutlined />} placeholder="Nhập email" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Số điện thoại"
                    name="phoneNumber"
                    rules={[
                      { required: true, message: "Vui lòng nhập SĐT" },
                      { pattern: /^[0-9]{10,11}$/, message: "Số điện thoại không hợp lệ" }
                    ]}
                  >
                    <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Ngày sinh"
                    name="dateOfBirth"
                    rules={[
                      { required: true, message: "Chọn ngày sinh" },
                      { validator: validateAge },
                    ]}
                  >
                    {/* Use DatePicker for better UX */}
                    <DatePicker
                      style={{ width: "100%" }}
                      placeholder="Chọn ngày sinh"
                      format="DD/MM/YYYY"
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Giới tính" name="gender">
                    <Radio.Group>
                      <Radio value={true}>Nam</Radio>
                      <Radio value={false}>Nữ</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Căn Cước Công Dân"
                    name="citizenIdentity"
                    rules={[
                      { required: true, message: "Căn Cước Công Dân" },
                      { pattern: /^[0-9]{12}$/, message: "Căn Cước Công Dân không hợp lệ" }
                    ]}
                  >
                    <Input placeholder="Nhập số điện thoại" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* Address Info */}
            <Card title="Địa chỉ liên hệ" bordered={false} style={{ borderRadius: 16 }}>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="Tỉnh/Thành phố"
                    name="provinceId"
                    rules={[{ required: true, message: "Chọn Tỉnh/TP" }]}
                  >
                    <Select
                      placeholder="Chọn Tỉnh/TP"
                      onChange={handleProvinceChange}
                      showSearch
                      optionFilterProp="children"
                    >
                      {listProvince.map((item) => (
                        <Option key={item.ProvinceID} value={item.ProvinceID}>
                          {item.ProvinceName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Quận/Huyện"
                    name="districtId"
                    rules={[{ required: true, message: "Chọn Quận/Huyện" }]}
                  >
                    <Select
                      placeholder="Chọn Quận/Huyện"
                      onChange={handleDistrictChange}
                      showSearch
                      optionFilterProp="children"
                      disabled={!listDistricts.length}
                    >
                      {listDistricts.map((item) => (
                        <Option key={item.DistrictID} value={item.DistrictID}>
                          {item.DistrictName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Xã/Phường"
                    name="wardCode"
                    rules={[{ required: true, message: "Chọn Xã/Phường" }]}
                  >
                    <Select
                      placeholder="Chọn Xã/Phường"
                      showSearch
                      optionFilterProp="children"
                      disabled={!listWard.length}
                    >
                      {listWard.map((item) => (
                        <Option key={item.WardCode} value={item.WardCode}>
                          {item.WardName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="Địa chỉ chi tiết"
                    name="line"
                    rules={[{ required: true, message: "Nhập địa chỉ cụ thể" }]}
                  >
                    <TextArea
                      rows={2}
                      placeholder="Số nhà, tên đường..."
                      showCount
                      maxLength={200}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Form>

      {/* Modal Preview Ảnh */}
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default CreateStaff;