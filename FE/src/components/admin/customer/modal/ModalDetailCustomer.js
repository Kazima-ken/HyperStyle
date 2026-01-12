import React, { useEffect, useState } from "react";
import {
  Modal, Input, Select, Button, Form, Row, Col, Upload, Radio, Card, Avatar, Divider, Space, Typography,
  Tag
} from "antd";
import {
  PlusOutlined, UserOutlined, MailOutlined, PhoneOutlined,
  CalendarOutlined, EnvironmentOutlined, ArrowLeftOutlined, CheckCircleOutlined
} from "@ant-design/icons";
import moment from "moment";
import { useAppDispatch } from "../../../../app/Hook";
import { CustomerApi } from "../../../../api/admin/account/customerApi";
import { AddressApi } from "../../../../api/admin/address/addressApi";
import { useParams, useNavigate } from "react-router-dom";
import "../style-customer.css";

const { Option } = Select;
const { Title, Text } = Typography;

const FormDetailCustomer = ({ visible }) => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [customer, setCustomer] = useState({});
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [listWard, setListWard] = useState([]);
  const [listDistricts, setListDistricts] = useState([]);

  const navigate = useNavigate();

  // --- GIỮ NGUYÊN LOGIC CHỨC NĂNG ---
  const getBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) file.preview = await getBase64(file.originFileObj);
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf("/") + 1));
  };

  const getOne = () => {
    if (id) {
      CustomerApi.getOne(id).then((res) => {
        AddressApi.getAddressByUserIdAndStatus(id).then((resAddress) => {
          const addressData = resAddress.data.data;
          setCustomer(res.data.data);
          const formValues = {
            ...res.data.data,
            dateOfBirth: moment(res.data.data.dateOfBirth).format("YYYY-MM-DD"),
          };
          if (addressData) {
            formValues.province = addressData.province;
            formValues.district = addressData.district;
            formValues.ward = addressData.ward;
            formValues.line = addressData.line;
          }
          form.setFieldsValue(formValues);
          if (addressData?.districtId) {
            AddressApi.getAllProvinceWard(addressData.districtId).then((resW) => setListWard(resW.data.data));
            AddressApi.getAllProvinceDistricts(addressData.provinceId).then((resD) => setListDistricts(resD.data.data));
          }
        });
        if (res.data.data?.avata) setUploadedFile({ url: res.data.data.avata });
      });
    }
  };

  useEffect(() => {
    if (id) getOne();
    form.resetFields();
    return () => setCustomer({});
  }, [id, visible]);

  const handleCancel = () => navigate("/customer-management");

  return (
    <div style={{ padding: "24px", background: "#f5f7fa", minHeight: "100vh" }}>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={handleCancel} shape="circle" />
          <Title level={3} style={{ margin: 0 }}>Hồ sơ khách hàng</Title>
        </Space>
        <Tag color={customer.status === "DANG_SU_DUNG" ? "green" : "red"} style={{ padding: "4px 12px", borderRadius: "12px" }}>
          {customer.status === "DANG_SU_DUNG" ? "Đang hoạt động" : "Ngừng kích hoạt"}
        </Tag>
      </div>

      <Row gutter={[24, 24]}>
        {/* Cột trái: Profile Card */}
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ textAlign: 'center', borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
            <div style={{ position: 'relative', marginBottom: 20 }}>
              <Upload
                listType="picture-circle"
                fileList={uploadedFile ? [uploadedFile] : []}
                onPreview={handlePreview}
                className="avatar-uploader"
                showUploadList={{ showRemoveIcon: false }}
              >
                {uploadedFile ? null : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Tải ảnh</div>
                  </div>
                )}
              </Upload>
            </div>
            <Title level={4}>{customer.fullName || "N/A"}</Title>
            <Text type="secondary">{customer.email || "Chưa cập nhật email"}</Text>

            <Divider />

            <div style={{ textAlign: 'left' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary"><UserOutlined /> Giới tính:</Text>
                  <Text strong>{customer.gender === true ? "Nam" : "Nữ"}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary"><PhoneOutlined /> Điện thoại:</Text>
                  <Text strong>{customer.phoneNumber || "N/A"}</Text>
                </div>
              </Space>
            </div>
          </Card>
        </Col>

        {/* Cột phải: Form chi tiết */}
        <Col xs={24} md={16}>
          <Form form={form} layout="vertical">
            <Card title="Thông tin cá nhân" bordered={false} style={{ borderRadius: 16, marginBottom: 24 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label={<Space><UserOutlined />Họ và tên</Space>} name="fullName">
                    <Input readOnly variant="filled" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={<Space><MailOutlined />Email</Space>} name="email">
                    <Input readOnly variant="filled" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={<Space><PhoneOutlined />Số điện thoại</Space>} name="phoneNumber">
                    <Input readOnly variant="filled" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={<Space><CalendarOutlined />Ngày sinh</Space>} name="dateOfBirth">
                    <Input type="date" readOnly variant="filled" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Giới tính" name="gender">
                    <Radio.Group disabled>
                      <Radio value={true}>Nam</Radio>
                      <Radio value={false}>Nữ</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card title="Địa chỉ mặc định" bordered={false} style={{ borderRadius: 16 }}>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="Tỉnh/Thành phố" name="province">
                    <Input readOnly variant="filled" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Quận/Huyện" name="district">
                    <Input readOnly variant="filled" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Xã/Phường" name="ward">
                    <Input readOnly variant="filled" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label={<Space><EnvironmentOutlined />Địa chỉ chi tiết</Space>} name="line">
                    <Input.TextArea rows={2} readOnly variant="filled" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Trạng thái tài khoản" name="status">
                    <Select disabled>
                      <Option value="DANG_SU_DUNG">Kích hoạt</Option>
                      <Option value="KHONG_SU_DUNG">Ngừng kích hoạt</Option>
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

export default FormDetailCustomer;