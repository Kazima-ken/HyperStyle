import React, { useEffect, useState } from "react";
import {
  Modal,
  Input,
  Select,
  Button,
  Form,
  Row,
  Col,
  Upload,
  Radio,
  message,
  Space,
  Card,
  DatePicker,
} from "antd";
import moment from "moment";
import { useAppDispatch } from "../../../../app/Hook";
import "react-toastify/dist/ReactToastify.css";
import { AccountApi } from "../../../../api/admin/account/accountApi";
import { UpdateAccount } from "../../../../app/reducer/AccountReducer";
import { useParams, useNavigate } from "react-router-dom";
import "../style-staff.css";
import {
  ArrowLeftOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
  SaveOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { AddressApi } from "../../../../api/admin/address/addressApi";
import axios from "axios";
import Title from "antd/es/skeleton/Title";
import TextArea from "antd/es/input/TextArea";

const { Option } = Select;

const UpdateStaff = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [staff, setStaff] = useState({});

  // State địa chỉ
  const [listProvince, setListProvince] = useState([]);
  const [listDistricts, setListDistricts] = useState([]);
  const [listWard, setListWard] = useState([]);

  // State ảnh (Sử dụng fileList chuẩn của AntD)
  const [fileList, setFileList] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  // --- XỬ LÝ ẢNH ---
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

  const handleChange = ({ fileList: newFileList }) => {
    // Giới hạn chỉ lấy file cuối cùng nếu muốn chọn 1 ảnh
    setFileList(newFileList);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Bạn chỉ có thể tải lên tệp JPG/PNG!");
    }
    // Trả về false để chặn auto upload của AntD (chúng ta tự xử lý khi submit form)
    return false;
  };

  // --- XỬ LÝ ĐỊA CHỈ ---
  const loadDataProvince = () => {
    AddressApi.getAllProvince().then((res) => {
      setListProvince(res.data.data);
    });
  };

  const handleProvinceChange = (value) => {
    // Reset Quận và Phường khi thay đổi Tỉnh
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

    if (value) {
      AddressApi.getAllProvinceWard(value).then((res) => {
        setListWard(res.data.data);
      });
    }
  };

  const getOne = async () => {
    if (!id) return;
    form.resetFields();

    try {
      // 1. Lấy thông tin Account
      const resAccount = await AccountApi.getOne(id);
      const accountData = resAccount.data.data;
      setStaff(accountData);

      if (accountData?.avata) {
        setFileList([
          {
            uid: '-1',              // ID giả định (âm để tránh trùng)
            name: 'avatar.png',     // Tên file hiển thị
            status: 'done',         // Trạng thái 'done' để hiện ảnh luôn, không hiện loading
            url: accountData.avata, // Đường dẫn ảnh từ API
          },
        ]);
      } else {
        setFileList([]); // Reset về rỗng nếu không có ảnh
      }

      // Tạo object formValues ban đầu
      const formValues = {
        ...accountData,
        dateOfBirth: accountData.dateOfBirth ? moment(accountData.dateOfBirth) : null,
        status: accountData.status,
      };

      // 2. Lấy thông tin Address
      try {
        const resAddress = await AddressApi.getAddressByUserIdAndStatus(id);
        const addressData = resAddress.data.data;

        if (addressData) {
          // --- SỬA CHÍNH TẠI ĐÂY ---

          // Gán đúng tên trường khớp với Form.Item (provinceId, districtId...)
          formValues.provinceId = addressData.provinceId;
          formValues.districtId = addressData.districtId;
          formValues.wardCode = addressData.wardCode;
          formValues.line = addressData.line;

          // QUAN TRỌNG: Load dữ liệu danh sách Quận/Huyện theo Tỉnh đã có
          if (addressData.provinceId) {
            const resDistricts = await AddressApi.getAllProvinceDistricts(addressData.provinceId);
            setListDistricts(resDistricts.data.data); // Cập nhật state để Select có dữ liệu
          }

          // QUAN TRỌNG: Load dữ liệu danh sách Xã/Phường theo Huyện đã có
          if (addressData.districtId) {
            const resWards = await AddressApi.getAllProvinceWard(addressData.districtId);
            setListWard(resWards.data.data); // Cập nhật state để Select có dữ liệu
          }
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
    loadDataProvince();
    if (id) {
      getOne();
    }
    return () => {
      form.resetFields();
    };
  }, [id]);

  // --- XỬ LÝ SUBMIT ---
  const handleOk = async () => {
    try {
      // 1. Validate Form
      const values = await form.validateFields();

      // 2. Confirm
      Modal.confirm({
        title: "Xác nhận",
        content: "Bạn có đồng ý cập nhật không?",
        onOk: async () => {
          try {
            const formattedDate = values.dateOfBirth ? values.dateOfBirth.format("YYYY-MM-DD") : null;

            // Lấy tên địa chính
            const provinceName = listProvince.find(p => p.ProvinceID === values.provinceId)?.ProvinceName || "";
            const districtName = listDistricts.find(d => d.DistrictID === values.districtId)?.DistrictName || "";
            const wardName = listWard.find(w => w.WardCode === values.wardCode)?.WardName || "";

            // Payload JSON
            const payload = {
              staff: {
                id: id,
                fullName: values.fullName,
                dateOfBirth: formattedDate,
                phoneNumber: values.phoneNumber,
                email: values.email,
                gender: values.gender,
                citizenIdentity: values.citizenIdentity,
                status: values.status,
              },
              address: {
                line: values.line,
                provinceId: values.provinceId,
                districtId: values.districtId,
                wardCode: values.wardCode,
                province: provinceName,
                district: districtName,
                ward: wardName,
                fullName: values.fullName,
                phoneNumber: values.phoneNumber,
                status: values.status,
              },
              account: {
                email: values.email,
                numberPhone: values.phoneNumber,
                roles: "ROLE_EMLOYEE",
                password: values.password || "Password@123",
              },
            };

            const formData = new FormData();
            formData.append("request", JSON.stringify(payload));

            if (fileList.length > 0 && fileList[0].originFileObj) {
              formData.append("file", fileList[0].originFileObj);
            }

            console.log("FORM DATA:");
            for (let pair of formData.entries()) {
              console.log(pair[0], pair[1]);
            }

            await AccountApi.update(id, formData);

            message.success("Cập nhật thành công");
            navigate("/staff-management");

          } catch (error) {
            console.error("Axios error:", error);

            if (error.response) {
              const data = error.response.data;

              // Backend trả ResponseObject
              if (data.message) {
                message.error(data.message);
              } else {
                message.error(JSON.stringify(data));
              }

            } else if (error.request) {
              message.error("Không kết nối được tới server");
            } else {
              message.error(error.message);
            }
          }
        },
      });
    } catch (info) {
      console.log("Validate Failed:", info);
      message.warning("Vui lòng kiểm tra lại thông tin nhập!");
    }
  };

  const validateAge = (rule, value) => {
    if (value) {
      const today = moment();
      const birthDate = moment(value);
      if (today.diff(birthDate, 'years') < 18) {
        return Promise.reject("Phải đủ 18 tuổi trở lên");
      }
    }
    return Promise.resolve();
  };

  return (
    <div style={{ padding: "24px", background: "#f5f7fa", minHeight: "100vh" }}>
      {/* HEADER */}
      <div style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/staff-management")} shape="circle" />
          <Title level={3} style={{ margin: 0 }}>Cập nhật Nhân Viên</Title>
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
          {/* LEFT COLUMN: AVATAR & ACCOUNT */}
          <Col xs={24} md={8} lg={6}>
            <Card bordered={false} style={{ textAlign: "center", borderRadius: 16, marginBottom: 24 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Title level={5}>Ảnh đại diện</Title>
                <Upload
                  listType="picture-circle"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  beforeUpload={beforeUpload}
                  maxCount={1}
                  accept="image/png, image/jpeg"
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

            <Card title="Cài đặt tài khoản" bordered={false} style={{ borderRadius: 16 }}>
              <Form.Item label="Trạng thái" name="status">
                <Select>
                  <Option value="DANG_SU_DUNG">Kích hoạt</Option>
                  <Option value="KHONG_SU_DUNG">Ngừng kích hoạt</Option>
                </Select>
              </Form.Item>
              {/* Mật khẩu thường không nên hiện sẵn ở update, hoặc để trống nếu không đổi */}
            </Card>
          </Col>

          {/* RIGHT COLUMN: INFO */}
          <Col xs={24} md={16} lg={18}>
            <Card title="Thông tin cá nhân" bordered={false} style={{ borderRadius: 16, marginBottom: 24 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Họ và tên" name="fullName" rules={[{ required: true, message: "Nhập họ tên" }]}>
                    <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Email" name="email" rules={[{ required: true, message: "Nhập email" }, { type: "email", message: "Email sai định dạng" }]}>
                    <Input prefix={<MailOutlined />} placeholder="Nhập email" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Số điện thoại" name="phoneNumber" rules={[{ required: true, message: "Nhập SĐT" }, { pattern: /^0\d{9}$/, message: "SĐT bắt đầu bằng 0 và có 10 số" }]}>
                    <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Ngày sinh" name="dateOfBirth" rules={[{ required: true, message: "Chọn ngày sinh" }, { validator: validateAge }]}>
                    <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" placeholder="Chọn ngày sinh" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Giới tính" name="gender">
                    <Radio.Group>
                      <Radio value={true}>Nam</Radio>
                      <Radio value={false}>Nữ</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Căn Cước Công Dân" name="citizenIdentity" rules={[{ required: true, message: "Nhập CCCD" }, { pattern: /^\d{12}$/, message: "CCCD gồm 12 số" }]}>
                    <Input placeholder="CCCD" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card title="Địa chỉ liên hệ" bordered={false} style={{ borderRadius: 16 }}>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="Tỉnh/Thành phố" name="provinceId" rules={[{ required: true, message: "Chọn Tỉnh/TP" }]}>
                    <Select placeholder="Chọn Tỉnh/TP" onChange={handleProvinceChange} showSearch optionFilterProp="children">
                      {listProvince.map((item) => (
                        <Option key={item.ProvinceID} value={item.ProvinceID}>{item.ProvinceName}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Quận/Huyện"
                    name="districtId" // Tên này phải khớp với trong getOne
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
                        // Đảm bảo value={item.DistrictID} cùng kiểu với dữ liệu districtId trong form
                        <Option key={item.DistrictID} value={item.DistrictID}>
                          {item.DistrictName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Xã/Phường" name="wardCode" rules={[{ required: true, message: "Chọn Xã/Phường" }]}>
                    <Select placeholder="Chọn Xã/Phường" showSearch optionFilterProp="children" disabled={!listWard.length}>
                      {listWard.map((item) => (
                        <Option key={item.WardCode} value={item.WardCode}>{item.WardName}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Địa chỉ chi tiết" name="line" rules={[{ required: true, message: "Nhập địa chỉ" }]}>
                    <TextArea rows={2} placeholder="Số nhà, đường..." maxLength={200} />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Form>

      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
        <img alt="preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
};
export default UpdateStaff;