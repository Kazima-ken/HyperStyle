import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button, Row, Col, message, Divider } from "antd";
import { UserOutlined, PhoneOutlined, HomeOutlined } from "@ant-design/icons";
import { AddressApi } from "../../../../api/admin/address/addressApi";
import { dispatch } from "../../../../app/store";
import { CreateAddressAccountClient } from "../../../../app/reducer/AddressAccountReducer";
import "./style-modal-create-address.css";

const { Option } = Select;

function ModalCreateAddressAccount({
  modalAddressAccount,
  setModalAddressAccount,
  getAddressDefault,
}) {
  const [form] = Form.useForm();
  const [listCity, setListCity] = useState([]);
  const [listDistrict, setListDistrict] = useState([]);
  const [listWard, setListWard] = useState([]);
  const [loading, setLoading] = useState(false);

  // Lấy danh sách tỉnh thành khi mở modal
  useEffect(() => {
    if (modalAddressAccount) {
      getCities();
    }
  }, [modalAddressAccount]);

  const getCities = () => {
    AddressApi.getAllProvince().then((res) => {
      setListCity(res.data.data);
    }).catch(err => console.error(err));
  };

  const closeModalCreate = () => {
    form.resetFields();
    setListDistrict([]);
    setListWard([]);
    setModalAddressAccount(false);
    // Nếu cần load lại địa chỉ mặc định sau khi đóng
    const idAccount = sessionStorage.getItem("idAccount");
    if (idAccount) getAddressDefault(idAccount);
  };

  // Xử lý khi chọn Tỉnh/Thành
  // 1. Sửa hàm chọn Tỉnh -> lấy Huyện
  const handleProvinceChange = (value, option) => {
    form.setFieldsValue({
      provinceId: option.provinceId,
      district: undefined,
      districtId: undefined,
      ward: undefined,
      wardCode: undefined
    });
    setListWard([]);

    // Đổi getAlldistrict thành getAllProvinceDistricts
    AddressApi.getAllProvinceDistricts(option.provinceId).then((res) => {
      setListDistrict(res.data.data || []);
    });
  };

  // 2. Sửa hàm chọn Huyện -> lấy Xã
  const handleDistrictChange = (value, option) => {
    form.setFieldsValue({
      districtId: option.districtId,
      ward: undefined,
      wardCode: undefined
    });

    // Đổi getAllWard thành getAllProvinceWard
    AddressApi.getAllProvinceWard(option.districtId).then((res) => {
      setListWard(res.data.data || []);
    });
  };

  const handleWardChange = (value, option) => {
    form.setFieldsValue({ wardCode: option.wardCode });
  };

  // Hàm gửi dữ liệu
  const handleCreateAddress = async () => {
    try {
      const idAccount = sessionStorage.getItem("idAccount");

      if (!idAccount) {
        message.error("Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại!");
        return;
      }

      const values = await form.validateFields();
      setLoading(true);

      const payload = {
        ...values,
        userId: idAccount,
        status: "DANG_SU_DUNG"
      };

      console.log("Payload gửi đi:", payload);

      const res = await AddressApi.createByAccount(payload);
      if (res.status === 200 || res.status === 201) {
        dispatch(CreateAddressAccountClient(res.data.data));
        message.success("Thêm mới địa chỉ thành công");
        closeModalCreate();
      }
    } catch (error) {
      console.error("Validate Failed:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal
      title={<div style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold' }}>Thêm mới địa chỉ</div>}
      open={modalAddressAccount}
      onCancel={closeModalCreate}
      footer={[
        <Button key="back" onClick={closeModalCreate}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleCreateAddress}
          style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }} // Màu sắc tùy chỉnh theo theme client
        >
          Thêm địa chỉ
        </Button>,
      ]}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ status: "DANG_SU_DUNG" }}
      >
        <Divider />
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
              label="Số điện thoại"
              name="phoneNumber"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
                { pattern: /^(03[2-9]|05[6-9]|07[0-9]|08[1-9]|09[0-9])[0-9]{7}$/, message: "Số điện thoại không đúng định dạng" }
              ]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Tỉnh/Thành phố"
          name="province"
          rules={[{ required: true, message: "Vui lòng chọn Tỉnh/Thành phố" }]}
        >
          <Select
            showSearch
            placeholder="Chọn Tỉnh/Thành phố"
            onChange={handleProvinceChange}
            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
          >
            {listCity.map((item) => (
              <Option key={item.ProvinceID} value={item.ProvinceName} provinceId={item.ProvinceID}>
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
              rules={[{ required: true, message: "Vui lòng chọn Quận/Huyện" }]}
            >
              <Select
                showSearch
                placeholder="Chọn Quận/Huyện"
                disabled={!listDistrict.length}
                onChange={handleDistrictChange}
                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
              >
                {listDistrict.map((item) => (
                  <Option key={item.DistrictID} value={item.DistrictName} districtId={item.DistrictID}>
                    {item.DistrictName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Phường/Xã"
              name="ward"
              rules={[{ required: true, message: "Vui lòng chọn Phường/Xã" }]}
            >
              <Select
                showSearch
                placeholder="Chọn Phường/Xã"
                disabled={!listWard.length}
                onChange={handleWardChange}
                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
              >
                {listWard.map((item) => (
                  <Option key={item.WardCode} value={item.WardName} wardCode={item.WardCode}>
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
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ cụ thể" }]}
        >
          <Input.TextArea prefix={<HomeOutlined />} placeholder="Số nhà, tên đường..." rows={2} />
        </Form.Item>

        {/* Các trường ẩn để gửi lên API */}
        <Form.Item name="provinceId" hidden><Input /></Form.Item>
        <Form.Item name="districtId" hidden><Input /></Form.Item>
        <Form.Item name="wardCode" hidden><Input /></Form.Item>
      </Form>
    </Modal>
  );
}

export default ModalCreateAddressAccount;