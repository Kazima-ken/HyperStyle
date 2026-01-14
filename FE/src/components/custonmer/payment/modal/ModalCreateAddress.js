import React, { useState, useEffect } from "react";
import { Drawer, Input, Select, Button, Form, Space, Row, Col, Divider, message } from "antd";
import { UserOutlined, PhoneOutlined, HomeOutlined, PlusOutlined } from "@ant-design/icons";
import { useAppDispatch } from "../../../../app/Hook";

import { AddressApi } from "../../../../api/admin/address/addressApi";
import { CreateAddress } from "../../../../app/reducer/AddressReducer";

const { Option } = Select;

const ModalCreateAddress = ({ visible, onCancel, id }) => {
  const [form] = Form.useForm();
  const [listProvince, setListProvince] = useState([]);
  const [listDistricts, setListDistricts] = useState([]);
  const [listWard, setListWard] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  // Hàm xử lý lưu địa chỉ
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const idAccount = sessionStorage.getItem("idAccount");

      if (!idAccount) {
        message.error("Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại!");
        return;
      }

      // Tạo payload chuẩn để gửi về Backend của bạn
      const payload = {
        ...values,
        userId: idAccount, // Đảm bảo lấy ID từ props truyền vào
        status: "DANG_SU_DUNG"
      };

      const res = await AddressApi.createByAccount(payload);

      // Kiểm tra phản hồi từ API
      if (res.status === 200 || res.status === 201) {
        dispatch(CreateAddress(res.data.data));
        message.success("Thêm địa chỉ mới thành công!");
        handleCancel();
      }
    } catch (error) {
      console.error("Lỗi khi thêm địa chỉ:", error);
      const errorMsg = error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!";
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setListDistricts([]);
    setListWard([]);
    onCancel();
  };

  // API Calls - Lấy danh sách Tỉnh/Thành
  const loadDataProvince = () => {
    AddressApi.getAllProvince()
      .then((res) => setListProvince(res.data.data))
      .catch((err) => console.error("Lỗi load tỉnh:", err));
  };

  // Khi chọn Tỉnh/Thành
  const handleProvinceChange = (value, option) => {
    // Lưu ID tỉnh vào field ẩn, reset huyện và xã
    form.setFieldsValue({
      provinceId: option.valueProvince,
      district: undefined,
      ward: undefined,
      districtId: undefined,
      wardCode: undefined
    });

    setListDistricts([]);
    setListWard([]);

    AddressApi.getAllProvinceDistricts(option.valueProvince)
      .then((res) => {
        setListDistricts(res.data.data || []);
      })
      .catch(() => setListDistricts([]));
  };

  // Khi chọn Quận/Huyện
  const handleDistrictChange = (value, option) => {
    // Lưu ID huyện vào field ẩn, reset xã
    form.setFieldsValue({
      districtId: option.valueDistrict,
      ward: undefined,
      wardCode: undefined
    });

    setListWard([]);

    AddressApi.getAllProvinceWard(option.valueDistrict)
      .then((res) => {
        setListWard(res.data.data || []);
      })
      .catch(() => setListWard([]));
  };

  // Khi chọn Xã/Phường
  const handleWardChange = (value, option) => {
    form.setFieldsValue({ wardCode: option.valueWard });
  };

  useEffect(() => {
    if (visible) {
      loadDataProvince();
      // Luôn set userId vào form khi modal mở
      form.setFieldsValue({ userId: id });
    }
  }, [visible, id, form]);

  return (
    <Drawer
      title={
        <Space>
          <PlusOutlined />
          <span>Tạo Địa Chỉ Giao Hàng Mới</span>
        </Space>
      }
      width={520}
      onClose={handleCancel}
      open={visible}
      destroyOnClose // Tự động dọn dẹp khi đóng
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={handleCancel}>Hủy</Button>
            <Button
              onClick={handleOk}
              type="primary"
              loading={loading}
            >
              Lưu địa chỉ
            </Button>
          </Space>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ userId: id, status: "DANG_SU_DUNG" }}
        requiredMark="optional"
      >
        <Divider orientation="left" plain>Thông tin người nhận</Divider>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Họ và tên"
              name="fullName"
              rules={[{ required: true, message: "Nhập họ tên" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Nguyễn Văn A" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Số điện thoại"
              name="phoneNumber"
              rules={[
                { required: true, message: "Nhập SĐT" },
                { pattern: /^0\d{9}$/, message: "SĐT phải có 10 số và bắt đầu bằng 0" },
              ]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="09xxxxxxx" />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left" plain>Địa chỉ chi tiết</Divider>

        <Form.Item
          label="Tỉnh/Thành phố"
          name="province"
          rules={[{ required: true, message: "Chọn tỉnh thành" }]}
        >
          <Select
            placeholder="Chọn Tỉnh/Thành phố"
            onChange={handleProvinceChange}
            showSearch
            filterOption={(input, option) =>
              (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
            }
          >
            {listProvince?.map((item) => (
              <Option key={item.ProvinceID} value={item.ProvinceName} valueProvince={item.ProvinceID}>
                {item.ProvinceName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Quận/Huyện"
              name="district"
              rules={[{ required: true, message: "Chọn quận huyện" }]}
            >
              <Select
                placeholder="Chọn Quận/Huyện"
                onChange={handleDistrictChange}
                disabled={!listDistricts.length}
                showSearch
              >
                {listDistricts.map((item) => (
                  <Option key={item.DistrictID} value={item.DistrictName} valueDistrict={item.DistrictID}>
                    {item.DistrictName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Xã/Phường"
              name="ward"
              rules={[{ required: true, message: "Chọn xã phường" }]}
            >
              <Select
                placeholder="Chọn Xã/Phường"
                onChange={handleWardChange}
                disabled={!listWard.length}
                showSearch
              >
                {listWard.map((item) => (
                  <Option key={item.WardCode} value={item.WardName} valueWard={item.WardCode}>
                    {item.WardName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Địa chỉ cụ thể"
          name="line"
          rules={[{ required: true, message: "Nhập địa chỉ chi tiết" }]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Số nhà, tên đường, ngõ hẻm..."
          />
        </Form.Item>

        {/* Hidden Fields: Để đảm bảo values lấy được các ID cần thiết */}
        <Form.Item name="userId" hidden><Input /></Form.Item>
        <Form.Item name="provinceId" hidden><Input /></Form.Item>
        <Form.Item name="districtId" hidden><Input /></Form.Item>
        <Form.Item name="wardCode" hidden><Input /></Form.Item>
        <Form.Item name="status" hidden><Input /></Form.Item>
      </Form>
    </Drawer>
  );
};

export default ModalCreateAddress;