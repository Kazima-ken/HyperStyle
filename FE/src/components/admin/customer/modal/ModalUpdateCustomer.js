import React, { useEffect, useState } from "react";
import {
  Modal, Input, Select, Button, Form, Row, Col, Upload, Radio, Space, Tag, Card, Typography,
  message
} from "antd";
import moment from "moment";
import { useAppDispatch } from "../../../../app/Hook";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeftOutlined, CalendarOutlined, EnvironmentOutlined,
  MailOutlined, PhoneOutlined, PlusOutlined, UserOutlined, SaveOutlined
} from "@ant-design/icons";
import axios from "axios";

// Import API của bạn (đường dẫn giả định, bạn chỉnh lại cho đúng project)
import { CustomerApi } from "../../../../api/admin/account/customerApi";
import { AddressApi } from "../../../../api/admin/address/addressApi";
import { UpdateCustomer } from "../../../../app/reducer/CustomerReducer";

import "../style-customer.css";

const { Option } = Select;
const { Title, Text } = Typography;

const ModalUpdateCustomer = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [customer, setCustomer] = useState({});
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // --- STATE ĐỊA CHỈ ---
  const [listProvince, setListProvince] = useState([]);
  const [listDistricts, setListDistricts] = useState([]);
  const [listWard, setListWard] = useState([]);

  // --- STATE ẢNH ---
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);

  // 1. XỬ LÝ ẢNH =========================================================
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
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf("/") + 1));
  };

  const handleChange = ({ fileList }) => {
    if (fileList.length > 0) {
      const file = fileList[fileList.length - 1];
      // Validate ảnh
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('Bạn chỉ có thể tải lên file JPG/PNG!');
        return;
      }
      setUploadedFile(file);
    } else {
      setUploadedFile(null);
    }
  };

  // 2. XỬ LÝ ĐỊA CHỈ (GHN API) ===========================================
  const loadDataProvince = () => {
    AddressApi.getAllProvince().then((res) => {
      setListProvince(res.data.data);
    });
  };

  const handleProvinceChange = (value) => {
    // Reset Quận/Huyện và Xã/Phường
    form.setFieldsValue({ districtId: undefined, wardCode: undefined });
    setListDistricts([]);
    setListWard([]);

    // Load Quận/Huyện mới
    AddressApi.getAllProvinceDistricts(value).then((res) => {
      setListDistricts(res.data.data);
    });
  };

  const handleDistrictChange = (value) => {
    // Reset Xã/Phường
    form.setFieldsValue({ wardCode: undefined });

    // Load Xã/Phường mới
    AddressApi.getAllProvinceWard(value).then((res) => {
      setListWard(res.data.data);
    });
  };

  // 3. LOAD DATA KHI VÀO TRANG ===========================================
  const getOne = () => {
    if (id) {
      CustomerApi.getOne(id).then((res) => {
        const userData = res.data.data;
        setCustomer(userData);

        // Lấy địa chỉ mặc định của user (Nếu API getOne không trả về address thì gọi API address riêng)
        AddressApi.getAddressByUserIdAndStatus(id).then((resAddress) => {
          const addressData = resAddress.data.data; // Giả sử API trả về 1 object address

          const formValues = {
            ...userData,
            dateOfBirth: userData.dateOfBirth ? moment(userData.dateOfBirth).format("YYYY-MM-DD") : null,
          };

          // Nếu có địa chỉ, fill vào form và load dữ liệu dropdown tương ứng
          if (addressData) {
            formValues.line = addressData.line;
            formValues.provinceId = addressData.provinceId;
            formValues.districtId = addressData.districtId; // Lưu ý: Backend trả về field tên gì thì map tên đó
            formValues.wardCode = addressData.wardCode;

            // Load danh sách Quận/Huyện dựa trên Tỉnh có sẵn
            if (addressData.provinceId) {
              AddressApi.getAllProvinceDistricts(addressData.provinceId).then(res => setListDistricts(res.data.data));
            }
            // Load danh sách Xã/Phường dựa trên Quận có sẵn
            if (addressData.districtId) {
              AddressApi.getAllProvinceWard(addressData.districtId).then(res => setListWard(res.data.data));
            }
          }

          form.setFieldsValue(formValues);
        });

        // Set ảnh avatar nếu có
        if (userData.avata) {
          setUploadedFile({
            url: userData.avata,
            uid: "-1",
            name: "avatar.png",
            status: "done",
          });
        }
      });
    }
  };

  useEffect(() => {
    loadDataProvince();
    getOne();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // 4. XỬ LÝ SUBMIT (QUAN TRỌNG) =========================================
  const handleOk = () => {
    form.validateFields().then((values) => {
      Modal.confirm({
        title: "Xác nhận",
        content: "Bạn có chắc chắn muốn cập nhật thông tin?",
        okText: "Đồng ý",
        cancelText: "Hủy",
        onOk: async () => {
          message.loading({ content: "Đang xử lý...", key: "update" });

          try {
            const formData = new FormData();

            // --- A. DATA CUSTOMER ---
            const customerData = {
              id: id,
              fullName: values.fullName,
              email: values.email,
              phoneNumber: values.phoneNumber,
              dateOfBirth: moment(values.dateOfBirth).valueOf(), // Chuyển về Long/Timestamp
              gender: values.gender,
              status: values.status,
              citizenIdentity: values.citizenIdentity
            };
            // Bọc JSON vào Blob để Backend @RequestPart("customer") hiểu
            formData.append("customer", new Blob([JSON.stringify(customerData)], { type: "application/json" }));

            // --- B. DATA ADDRESS (Nếu có nhập) ---
            if (values.provinceId && values.districtId && values.wardCode) {
              // Tìm tên Tỉnh/Huyện/Xã từ ID (Vì Dropdown chỉ lưu ID)
              const provinceName = listProvince.find(x => x.ProvinceID === values.provinceId)?.ProvinceName;
              const districtName = listDistricts.find(x => x.DistrictID === values.districtId)?.DistrictName;
              const wardName = listWard.find(x => x.WardCode === values.wardCode)?.WardName;

              const addressData = {
                // Id địa chỉ lấy từ API getOne lúc đầu (nếu cần update đúng dòng đó), 
                // ở đây tạm thời để null để backend tự xử lý logic tìm/tạo mới
                // id: addressId, 
                line: values.line,
                province: provinceName,
                district: districtName,
                ward: wardName,
                provinceId: values.provinceId,
                districtId: values.districtId,
                wardCode: values.wardCode,
                fullName: values.fullName,     // Người nhận trùng tên user
                phoneNumber: values.phoneNumber // SĐT nhận trùng SĐT user
              };
              formData.append("address", new Blob([JSON.stringify(addressData)], { type: "application/json" }));
            }

            // --- C. FILE ẢNH ---
            if (uploadedFile && uploadedFile.originFileObj) {
              // Trường hợp upload ảnh mới
              formData.append("file", uploadedFile.originFileObj);
            }

            const res = await CustomerApi.update(id, formData);

            dispatch(UpdateCustomer(res.data)); // Update Redux nếu cần
            message.success({ content: "Cập nhật thành công!", key: "update" });
            navigate("/customer-management"); // Quay về trang danh sách

          } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data || "Có lỗi xảy ra!";
            message.error({ content: errorMsg, key: "update" });
          }
        },
      });
    });
  };

  const handleCancel = () => navigate("/customer-management");

  return (
    <div style={{ padding: "24px", background: "#f5f7fa", minHeight: "100vh" }}>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={handleCancel} shape="circle" />
          <Title level={3} style={{ margin: 0 }}>Cập nhật khách hàng</Title>
        </Space>
        <Space>
          <Tag color={customer.status === "DANG_SU_DUNG" || customer.status === "ACTIVE" ? "green" : "red"} style={{ padding: "6px 12px", borderRadius: "12px", marginRight: 10 }}>
            {customer.status === "DANG_SU_DUNG" || customer.status === "ACTIVE" ? "Đang hoạt động" : "Ngừng kích hoạt"}
          </Tag>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleOk} size="large" style={{ borderRadius: 8 }}>
            Lưu thay đổi
          </Button>
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        {/* Cột trái: Avatar */}
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ textAlign: 'center', borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
            <div style={{ marginBottom: 20 }}>
              <Upload
                listType="picture-circle"
                fileList={uploadedFile ? [uploadedFile] : []}
                onPreview={handlePreview}
                onChange={handleChange}
                showUploadList={{ showRemoveIcon: true }}
                beforeUpload={() => false} // Chặn auto upload
                maxCount={1}
              >
                {!uploadedFile && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Tải ảnh</div>
                  </div>
                )}
              </Upload>
            </div>
            <Title level={4}>{customer.fullName || "Tên khách hàng"}</Title>
            <Text type="secondary">{customer.email}</Text>
          </Card>
        </Col>

        {/* Cột phải: Form nhập liệu */}
        <Col xs={24} md={16}>
          <Form form={form} layout="vertical">
            <Card title="Thông tin cá nhân" bordered={false} style={{ borderRadius: 16, marginBottom: 24 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label={<Space><UserOutlined />Họ và tên</Space>} name="fullName" rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}>
                    <Input placeholder="Nhập họ và tên" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={<Space><MailOutlined />Email</Space>} name="email" rules={[{ required: true, message: "Vui lòng nhập email" }, { type: "email", message: "Email không hợp lệ" }]}>
                    <Input placeholder="Nhập email" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={<Space><PhoneOutlined />Số điện thoại</Space>} name="phoneNumber" rules={[{ required: true, message: "Vui lòng nhập SĐT" }]}>
                    <Input placeholder="Nhập số điện thoại" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={<Space><CalendarOutlined />Ngày sinh</Space>} name="dateOfBirth" rules={[{ required: true, message: "Chọn ngày sinh" }]}>
                    <Input type="date" />
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
              </Row>
            </Card>

            <Card title="Địa chỉ & Trạng thái" bordered={false} style={{ borderRadius: 16 }}>
              <Row gutter={16}>
                <Col span={8}>
                  {/* Lưu ý: name="provinceId" phải khớp với field bạn set trong form.setFieldsValue */}
                  <Form.Item label="Tỉnh/Thành phố" name="provinceId" rules={[{ required: true, message: "Chọn Tỉnh/TP" }]}>
                    <Select placeholder="Chọn Tỉnh/TP" onChange={handleProvinceChange} showSearch optionFilterProp="children">
                      {listProvince.map((item) => (
                        <Option key={item.ProvinceID} value={item.ProvinceID}>{item.ProvinceName}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  {/* Sửa tên name="districtId" cho đúng chuẩn backend */}
                  <Form.Item label="Quận/Huyện" name="districtId" rules={[{ required: true, message: "Chọn Quận/Huyện" }]}>
                    <Select placeholder="Chọn Quận/Huyện" onChange={handleDistrictChange} showSearch optionFilterProp="children">
                      {listDistricts.map((item) => (
                        <Option key={item.DistrictID} value={item.DistrictID}>{item.DistrictName}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Xã/Phường" name="wardCode" rules={[{ required: true, message: "Chọn Xã/Phường" }]}>
                    <Select placeholder="Chọn Xã/Phường" showSearch optionFilterProp="children">
                      {listWard.map((item) => (
                        <Option key={item.WardCode} value={item.WardCode}>{item.WardName}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label={<Space><EnvironmentOutlined />Địa chỉ chi tiết</Space>} name="line" rules={[{ required: true, message: "Nhập địa chỉ cụ thể" }]}>
                    <Input.TextArea rows={2} placeholder="Số nhà, tên đường..." />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Trạng thái tài khoản" name="status">
                    <Select>
                      <Option value="DANG_SU_DUNG">Kích hoạt</Option>
                      <Option value="KHONG_SU_DUNG">Ngừng kích hoạt</Option>
                      <Option value="ACTIVE">Active (Nếu backend dùng enum tiếng Anh)</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Form>
        </Col>
      </Row>

      {/* Modal Preview Ảnh */}
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
        <img alt="preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default ModalUpdateCustomer;