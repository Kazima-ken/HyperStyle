import { Modal, Input, Select, Button, Form, Row, Col, message } from "antd";
import { useAppDispatch } from "../../../../app/Hook";
import { ColorApi } from "../../../../api/admin/color/ColorApi";
import { CreateColor } from "../../../../app/reducer/ColorReducer";

import convert from "color-convert";

const ModalCreateColor = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const initialValues = {
    code: "",
    name: "",
    status: "DANG_SU_DUNG",
  };

  const getColorName = (colorCode) => {
    const hexCode = colorCode.replace("#", "").toUpperCase();
    const rgb = convert.hex.rgb(hexCode);
    const colorName = convert.rgb.keyword(rgb);

    if (colorName === null) {
      return "Unknown";
    } else {
      return colorName;
    }
  };

  const handleOkAdd = async () => {
    try {
      const values = await form.validateFields();

      Modal.confirm({
        title: "Xác nhận",
        content: "Bạn có đồng ý thêm màu sắc này không?",
        okText: "Đồng ý",
        cancelText: "Hủy",
        onOk: async () => {
          try {
            const res = await ColorApi.createcolor(values);
            dispatch(CreateColor(res.data.data));
            message.success("Thêm thành công");
            form.resetFields();
            onCancel();
          } catch (error) {
            // Hiển thị message lỗi từ Backend (ví dụ: "Color Đã Tồn Tại")
            const errorMsg = error.response?.data?.message || "Có lỗi xảy ra";
            message.error(errorMsg);
          }
        },
      });
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Thêm màu sắc"
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>Hủy</Button>,
        <Button key="submit" type="primary" onClick={handleOkAdd}>Thêm</Button>,
      ]}
    >
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Row gutter={16} align="middle">
          <Col span={12}>
            <Form.Item label="Chọn màu từ bảng" name="colorPicker">
              <Input
                type="color"
                style={{ height: "150px", cursor: "pointer" }}
                onChange={(e) => {
                  const maMau = e.target.value;
                  const tenMau = getColorName(maMau);
                  // Cập nhật cả 2 trường Code và Name
                  form.setFieldsValue({
                    code: maMau.toUpperCase(),
                    name: tenMau
                  });
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Mã màu (HEX)"
              name="code"
              rules={[{ required: true, message: "Vui lòng nhập mã màu" }]}
            >
              <Input placeholder="#FFFFFF" style={{ height: "40px" }} />
            </Form.Item>

            <Form.Item
              label="Tên màu sắc"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên màu" }]}
            >
              <Input placeholder="Tên màu" style={{ height: "40px" }} />
            </Form.Item>

            <Form.Item label="Trạng thái" name="status">
              <Select>
                <Select.Option value="DANG_SU_DUNG">Đang sử dụng</Select.Option>
                <Select.Option value="KHONG_SU_DUNG">Không sử dụng</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalCreateColor;
