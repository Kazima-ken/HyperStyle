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
  const [listDistricts, setListDistricts] = useState([]); // Luôn có []
  const [listWard, setListWard] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Gán id người dùng vào object gửi đi
      const payload = { ...values, userId: id };

      const res = await AddressApi.create(payload);
      dispatch(CreateAddress(res.data.data));
      message.success("Thêm địa chỉ mới thành công!");
      handleCancel();
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.message);
      }
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

  // API Calls
  const loadDataProvince = () => {
    AddressApi.getAllProvince().then((res) => setListProvince(res.data.data));
  };

  const handleProvinceChange = (value, option) => {
    // Reset các trường cấp dưới khi đổi cấp trên
    form.setFieldsValue({
      provinceId: option.valueProvince,
      district: undefined,
      ward: undefined
    });
    setListDistricts([]); // Reset ngay lập tức để tránh lỗi
    setListWard([]);

    AddressApi.getAllProvinceDistricts(option.valueProvince).then((res) => {
      // Nếu res.data.data là null, nó sẽ lấy mảng rỗng []
      setListDistricts(res.data.data || []);
    }).catch(() => setListDistricts([]));
  };

  const handleDistrictChange = (value, option) => {
    form.setFieldsValue({
      districtId: option.valueDistrict,
      ward: undefined
    });
    setListWard([]);

    AddressApi.getAllProvinceWard(option.valueDistrict).then((res) => {
      setListWard(res.data.data || []);
    }).catch(() => setListWard([]));
  };

  const handleWardChange = (value, option) => {
    form.setFieldsValue({ wardCode: option.valueWard });
  };

  useEffect(() => {
    if (visible) loadDataProvince();
  }, [visible]);

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
      bodyStyle={{ paddingBottom: 80 }}
      extra={
        <Space>
          <Button onClick={handleCancel}>Hủy</Button>
          <Button
            onClick={handleOk}
            type="primary"
            loading={loading}
            style={{ backgroundColor: '#1890ff' }}
          >
            Lưu địa chỉ
          </Button>
        </Space>
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
                { pattern: /^0\d{9}$/, message: "SĐT không hợp lệ" },
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
          <Select placeholder="Chọn Tỉnh/Thành phố" onChange={handleProvinceChange} showSearch filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}>
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
                // Sử dụng ?. để nếu listDistricts là null thì sẽ không bị crash
                disabled={!listDistricts?.length}
              >
                {listDistricts?.map((item) => (
                  <Option
                    key={item.DistrictID}
                    value={item.DistrictName}
                    valueDistrict={item.DistrictID}
                  >
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
              {/* Select Xã/Phường */}
              <Select
                placeholder="Chọn Xã/Phường"
                onChange={handleWardChange}
                disabled={!listWard?.length}
              >
                {listWard?.map((item) => (
                  <Option
                    key={item.WardCode}
                    value={item.WardName}
                    valueWard={item.WardCode}
                  >
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
            prefix={<HomeOutlined />}
          />
        </Form.Item>

        {/* Hidden Fields */}
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