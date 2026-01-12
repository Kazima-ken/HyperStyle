import React, { useEffect, useState } from "react";
import {
  Modal, Input, Select, Button, Form, Row, Col, Upload, message, Radio, Space, Tag, Card, Divider,
} from "antd";
import moment from "moment";
import { useAppDispatch } from "../../../../app/Hook";
import "react-toastify/dist/ReactToastify.css";
import { AccountApi } from "../../../../api/admin/account/accountApi";
import { UpdateAccount } from "../../../../app/reducer/AccountReducer";
import { useParams, useNavigate } from "react-router-dom";
import "../style-staff.css";
import { ArrowLeftOutlined, CalendarOutlined, EnvironmentOutlined, MailOutlined, PhoneOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { AddressApi } from "../../../../api/admin/address/addressApi";
import Title from "antd/es/skeleton/Title";
import { Text } from "@chakra-ui/react";
const { Option } = Select;

const DetailStaff = ({ visible }) => {
  const { id } = useParams();
  const [form] = Form.useForm();

  // Chỉ dùng 1 biến state chính để đỡ nhầm lẫn
  const [staff, setStaff] = useState({});
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // --- Xử lý ảnh ---
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [listWard, setListWard] = useState([]);
  const [listDistricts, setListDistricts] = useState([]);

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

  // --- Hàm lấy dữ liệu ---
  // --- Hàm lấy dữ liệu (Đã sửa lỗi hiển thị ID) ---
  const getOne = async () => {
    if (!id) return;

    // Reset form để tránh lưu dữ liệu cũ
    form.resetFields();

    try {
      // 1. Lấy thông tin Account
      const resAccount = await AccountApi.getOne(id);
      const accountData = resAccount.data.data;
      setStaff(accountData); // Cập nhật state để hiển thị cột bên trái

      if (accountData?.avata) {
        setUploadedFile({ url: accountData.avata });
      }

      // Tạo object dữ liệu ban đầu cho Form
      const formValues = {
        ...accountData,
        dateOfBirth: accountData.dateOfBirth ? moment(accountData.dateOfBirth).format("YYYY-MM-DD") : null,
        status: accountData.status
      };

      // 2. Lấy thông tin Address
      try {
        const resAddress = await AddressApi.getAddressByUserIdAndStatus(id);
        const addressData = resAddress.data.data;

        if (addressData) {
          // Mặc định gán ID trước, nếu tìm thấy tên thì sẽ ghi đè sau
          let provinceDisplay = addressData.provinceId;
          let districtDisplay = addressData.districtId;
          let wardDisplay = addressData.wardCode;

          // --- LOGIC TÌM TÊN TỈNH ---
          try {
            const resP = await AddressApi.getAllProvince();
            // Data có thể nằm ở .data hoặc .data.data tùy API
            const listP = resP.data.data || resP.data;
            // Tìm đối tượng tỉnh có ID trùng với addressData.provinceId
            const foundP = listP.find(p => p.ProvinceID == addressData.provinceId);
            if (foundP) provinceDisplay = foundP.ProvinceName;
          } catch (err) { console.log("Lỗi lấy Tỉnh:", err) }

          // --- LOGIC TÌM TÊN HUYỆN ---
          if (addressData.provinceId) {
            try {
              const resD = await AddressApi.getAllProvinceDistricts(addressData.provinceId);
              const listD = resD.data.data || resD.data;
              const foundD = listD.find(d => d.DistrictID == addressData.districtId);
              if (foundD) districtDisplay = foundD.DistrictName;
            } catch (err) { console.log("Lỗi lấy Huyện:", err) }
          }

          // --- LOGIC TÌM TÊN XÃ ---
          if (addressData.districtId) {
            try {
              const resW = await AddressApi.getAllProvinceWard(addressData.districtId);
              const listW = resW.data.data || resW.data;
              const foundW = listW.find(w => w.WardCode == addressData.wardCode);
              if (foundW) wardDisplay = foundW.WardName;
            } catch (err) { console.log("Lỗi lấy Xã:", err) }
          }

          // Gán các tên đã tìm được vào formValues
          formValues.province = provinceDisplay;
          formValues.district = districtDisplay;
          formValues.ward = wardDisplay;
          formValues.line = addressData.line;
        }
      } catch (error) {
        console.log("User chưa có địa chỉ hoặc lỗi API địa chỉ");
      }

      // Cuối cùng: Đổ dữ liệu vào form
      form.setFieldsValue(formValues);

    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
      message.error("Có lỗi khi tải thông tin!");
    }
  };

  useEffect(() => {
    getOne();
    return () => {
      setStaff({});
      setUploadedFile(null);
    };
  }, [id, visible]);

  const handleCancel = () => {
    navigate("/staff-management");
  };

  return (
    <div style={{ padding: "24px", background: "#f5f7fa", minHeight: "100vh" }}>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={handleCancel} shape="circle" />
          <Title level={3} style={{ margin: 0 }}>Hồ sơ khách hàng</Title>
        </Space>
        {/* Đã sửa staff.status để lấy đúng dữ liệu từ state staff */}
        <Tag color={staff.status === "DANG_SU_DUNG" ? "green" : "red"} style={{ padding: "4px 12px", borderRadius: "12px" }}>
          {staff.status === "DANG_SU_DUNG" ? "Đang hoạt động" : "Ngừng kích hoạt"}
        </Tag>
      </div>

      <Row gutter={[24, 24]}>
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
                  <div><PlusOutlined /><div style={{ marginTop: 8 }}>Tải ảnh</div></div>
                )}
              </Upload>
            </div>
            {/* Đảm bảo hiển thị đúng biến staff */}
            <Title level={4}>{staff.fullName || "N/A"}</Title>
            <Text type="secondary">{staff.email || "Chưa cập nhật email"}</Text>

            <Divider />

            <div style={{ textAlign: 'left' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary"><UserOutlined /> Giới tính:</Text>
                  <Text strong>{staff.gender === true ? "Nam" : "Nữ"}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary"><PhoneOutlined /> Điện thoại:</Text>
                  <Text strong>{staff.phoneNumber || "N/A"}</Text>
                </div>
              </Space>
            </div>
          </Card>
        </Col>

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
                    <Input readOnly variant="filled" placeholder="Chưa cập nhật" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Quận/Huyện" name="district">
                    <Input readOnly variant="filled" placeholder="Chưa cập nhật" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Xã/Phường" name="ward">
                    <Input readOnly variant="filled" placeholder="Chưa cập nhật" />
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

      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
        <img alt="preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  )
};
export default DetailStaff;