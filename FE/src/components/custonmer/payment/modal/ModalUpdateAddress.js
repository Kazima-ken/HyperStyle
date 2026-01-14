import React, { useState, useEffect } from "react";
import { Modal, Input, Select, Button, Form, message } from "antd";
import { useAppDispatch } from "../../../../app/Hook";
import { UpdateAddress } from "../../../../app/reducer/AddressReducer";
import { AddressApi } from "../../../../api/admin/address/addressApi";

const { Option } = Select;

const ModalUpdateAddress = ({ visible, id, onCancel }) => {
  const [form] = Form.useForm();

  // State lưu danh sách địa chính
  const [listProvince, setListProvince] = useState([]);
  const [listDistricts, setListDistricts] = useState([]);
  const [listWard, setListWard] = useState([]);

  // State trạng thái
  const [statusAddress, setStatusAddress] = useState("");
  const dispatch = useAppDispatch();

  // --- HÀM LẤY CHI TIẾT ĐỊA CHỈ ---
  const getOne = () => {
    if (!id) return;

    // LƯU Ý: Kiểm tra lại tên hàm trong AddressApi (getOne, getDetail, hay getAddress...)
    AddressApi.getOne(id).then((res) => {
      const data = res.data.data;
      if (data) {
        const userId = data.userId || (data.user ? data.user.id : null);

        // 1. Fill dữ liệu vào Form
        form.setFieldsValue({
          ...data,
          userId: userId,
        });

        // 2. Lưu trạng thái để hiển thị Select Status
        setStatusAddress(data.status);

        // 3. Load danh sách Quận/Huyện dựa theo ProvinceID đã lưu
        if (data.provinceId) {
          AddressApi.getAllProvinceDistricts(data.provinceId).then((resDistrict) => {
            setListDistricts(resDistrict.data.data);
          });
        }

        // 4. Load danh sách Phường/Xã dựa theo DistrictID đã lưu
        if (data.districtId) {
          AddressApi.getAllProvinceWard(data.districtId).then((resWard) => {
            setListWard(resWard.data.data);
          });
        }
      }
    }).catch(err => {
      console.error("Lỗi lấy chi tiết địa chỉ:", err);
    });
  };

  // --- EFFECT KHI MỞ MODAL ---
  useEffect(() => {
    if (visible && id) {
      getOne();
    } else {
      form.resetFields();
    }
  }, [id, visible]);

  // --- EFFECT LOAD TỈNH THÀNH LÚC ĐẦU ---
  useEffect(() => {
    loadDataProvince();
  }, []);

  const loadDataProvince = () => {
    AddressApi.getAllProvince().then(
      (res) => {
        setListProvince(res.data.data);
      },
      (err) => {
        console.log(err);
      }
    );
  };

  // --- XỬ LÝ KHI THAY ĐỔI DROP DOWN ---

  // 1. Chọn Tỉnh -> Reset Quận + Phường -> Load Quận mới
  const handleProvinceChange = (value, option) => {
    form.setFieldsValue({
      provinceId: option.valueProvince,
      district: undefined,    // Xóa quận cũ
      districtId: undefined,
      ward: undefined,        // Xóa phường cũ
      wardCode: undefined
    });
    setListDistricts([]);
    setListWard([]);

    AddressApi.getAllProvinceDistricts(option.valueProvince).then(
      (res) => {
        setListDistricts(res.data.data);
      }
    );
  };

  // 2. Chọn Quận -> Reset Phường -> Load Phường mới
  const handleCityChange = (value, option) => {
    form.setFieldsValue({
      districtId: option.valueDistrict, // SỬA: districtId -> districtId
      ward: undefined,
      wardCode: undefined
    });
    setListWard([]);

    AddressApi.getAllProvinceWard(option.valueDistrict).then((res) => {
      setListWard(res.data.data);
    });
  };
  // 3. Chọn Phường
  const handleWardChange = (value, option) => {
    form.setFieldsValue({ wardCode: option.valueWard });
  };

  // --- XỬ LÝ SUBMIT ---
  const handleOk = () => {
    form.validateFields().then((values) => {
      Modal.confirm({
        title: "Xác nhận",
        content: "Bạn có đồng ý cập nhật địa chỉ này không?",
        okText: "Đồng ý",
        cancelText: "Hủy",
        onOk: () => {
          AddressApi.update(id, values)
            .then((res) => {
              dispatch(UpdateAddress(res.data.data)); // Cập nhật Redux (nếu có)
              message.success("Cập nhật thành công");
              handleCancel(); // Đóng modal
            })
            .catch((error) => {
              const msg = error.response?.data?.message || "Cập nhật thất bại";
              message.error(msg);
              console.log("Update failed:", error);
            });
        },
      });
    }).catch(() => {
      // Validate fail
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Cập nhật địa chỉ"
      open={visible} // Antd v5 dùng 'open', v4 dùng 'visible'. Nếu lỗi hãy đổi lại thành visible
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Cập nhật
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ userId: "" }}
      >
        <Form.Item
          label="Họ và tên"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
        >
          <Input placeholder="Họ và tên" />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phoneNumber"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
        >
          <Input placeholder="Số điện thoại" />
        </Form.Item>

        <Form.Item
          label="Tỉnh/Thành phố"
          name="province"
          rules={[{ required: true, message: "Vui lòng chọn Tỉnh/Thành phố" }]}
        >
          <Select onChange={handleProvinceChange} placeholder="Chọn Tỉnh/Thành phố">
            {listProvince?.map((item) => (
              <Option
                key={item.ProvinceID}
                value={item.ProvinceName}
                valueProvince={item.ProvinceID}
              >
                {item.ProvinceName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Quận/Huyện"
          name="district"
          rules={[{ required: true, message: "Vui lòng chọn Quận/Huyện" }]}
        >
          <Select onChange={handleCityChange} placeholder="Chọn Quận/Huyện">
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

        <Form.Item
          label="Xã/Phường"
          name="ward"
          rules={[{ required: true, message: "Vui lòng chọn Xã/Phường" }]}
        >
          <Select onChange={handleWardChange} placeholder="Chọn Xã/Phường">
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

        <Form.Item
          label="Số nhà/Ngõ/Đường"
          name="line"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ cụ thể" }]}
        >
          <Input placeholder="Số nhà/Ngõ/Đường" />
        </Form.Item>

        <Form.Item label="Trạng thái" name="status">
          <Select disabled={statusAddress === "DANG_SU_DUNG"}>
            <Option value="DANG_SU_DUNG">Mặc định</Option>
            <Option value="KHONG_SU_DUNG">Không sử dụng</Option>
          </Select>
        </Form.Item>

        {/* CÁC TRƯỜNG ẨN ĐỂ LƯU ID GỬI VỀ BE */}
        <Form.Item name="userId" hidden><Input /></Form.Item>
        <Form.Item name="districtId" hidden><Input /></Form.Item>
        <Form.Item name="provinceId" hidden><Input /></Form.Item>
        <Form.Item name="wardCode" hidden><Input /></Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalUpdateAddress;