import { Modal, Input, Select, Button, Form, Row, Col, message, Tooltip, Tag, Divider } from "antd";
import { useAppDispatch, useAppSelector } from "../../../../app/Hook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { faPlus, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { ColorApi } from "../../../../api/admin/color/ColorApi";
import { CreateColor, GetColor, SetColor } from "../../../../app/reducer/ColorReducer";
import convert from "color-convert";

const AddColorModal = ({ visible, onCancel, onSaveData }) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selected, setSelected] = useState([]); // Lưu mảng mã màu đã chọn
  const [listColor, setListColor] = useState([]);
  const [colorPickerValue, setColorPickerValue] = useState("#1890ff");

  const data = useAppSelector(GetColor);

  useEffect(() => {
    if (data) setListColor(data);
  }, [data]);

  const getList = () => {
    ColorApi.getAllCode().then((res) => {
      setListColor(res.data.data);
      dispatch(SetColor(res.data.data));
    });
  };

  useEffect(() => {
    getList();
  }, []);

  const toggleSelection = (colorCode) => {
    setSelected((prev) =>
      prev.includes(colorCode)
        ? prev.filter((item) => item !== colorCode)
        : [...prev, colorCode]
    );
  };

  const handleOk = () => {
    if (selected.length === 0) {
      message.warning("Vui lòng chọn ít nhất một màu sắc!");
      return;
    }
    onSaveData(selected);
    setSelected([]);
    onCancel();
  };

  // --- LOGIC XỬ LÝ MÀU ---
  const handleColorPickerChange = (e) => {
    const maMau = e.target.value.toUpperCase();
    setColorPickerValue(maMau);
    try {
      const rgb = convert.hex.rgb(maMau.replace("#", ""));
      const colorName = convert.rgb.keyword(rgb) || "New Color";
      form.setFieldsValue({ code: maMau, name: colorName });
    } catch (err) {
      form.setFieldsValue({ code: maMau });
    }
  };

  return (
    <>
      <Modal
        title={<span style={{ fontSize: 20, fontWeight: 700 }}>Bảng chọn màu sắc</span>}
        open={visible}
        onOk={handleOk}
        onCancel={onCancel}
        okText="Xác nhận chọn"
        cancelText="Đóng"
        width={800}
        bodyStyle={{ padding: '20px 24px' }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <span style={{ color: '#8c8c8c' }}>Đã chọn: <b style={{ color: '#1890ff' }}>{selected.length}</b> màu sắc</span>
          <Button
            onClick={() => setAddModalVisible(true)}
            icon={<FontAwesomeIcon icon={faPlus} />}
            type="primary"
            shape="round"
          >
            Tạo màu mới
          </Button>
        </div>

        <div style={{ maxHeight: "400px", overflowY: "auto", overflowX: "hidden", padding: "4px" }}>
          <Row gutter={[16, 16]}>
            {listColor.map((color) => {
              const isSelected = selected.includes(color.code);
              return (
                <Col key={color.id || color.code} xs={12} sm={8} md={6}>
                  <div
                    onClick={() => toggleSelection(color.code)}
                    style={{
                      cursor: "pointer",
                      padding: "12px",
                      borderRadius: "12px",
                      border: isSelected ? "2px solid #1890ff" : "1px solid #f0f0f0",
                      backgroundColor: isSelected ? "#e6f7ff" : "#fff",
                      transition: "all 0.3s",
                      position: "relative",
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    {isSelected && (
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        style={{ position: "absolute", top: 5, right: 5, color: "#1890ff" }}
                      />
                    )}
                    <div
                      style={{
                        width: "100%",
                        height: "40px",
                        borderRadius: "8px",
                        backgroundColor: color.code,
                        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.05)"
                      }}
                    />
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 600, fontSize: "13px", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '120px' }}>
                        {color.name}
                      </div>
                      <div style={{ fontSize: "11px", color: "#8c8c8c" }}>{color.code}</div>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </div>
      </Modal>

      {/* --- MODAL THÊM MỚI (Giao diện hiện đại) --- */}
      <Modal
        title={<span style={{ fontWeight: 700 }}>Thêm màu sắc vào hệ thống</span>}
        open={isAddModalVisible}
        onCancel={() => { setAddModalVisible(false); form.resetFields(); }}
        onOk={() => {
          form.validateFields().then(async (values) => {
            try {
              await ColorApi.createcolor(values);
              message.success("Thành công!");
              setAddModalVisible(false);
              form.resetFields();
              getList();
            } catch (err) {
              message.error(err.response?.data?.message || "Lỗi!");
            }
          });
        }}
        width={500}
        okText="Lưu dữ liệu"
      >
        <Divider style={{ marginTop: 0 }} />
        <Form form={form} layout="vertical" initialValues={{ status: "DANG_SU_DUNG" }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{
              display: 'inline-block',
              padding: '8px',
              borderRadius: '50%',
              border: '2px dashed #d9d9d9',
              marginBottom: 8
            }}>
              <input
                type="color"
                value={colorPickerValue}
                onChange={handleColorPickerChange}
                style={{ width: 80, height: 80, border: 'none', borderRadius: '50%', cursor: 'pointer', padding: 0 }}
              />
            </div>
            <p style={{ color: '#8c8c8c', fontSize: 12 }}>Nhấp vào vòng tròn để chọn màu nhanh</p>
          </div>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Mã màu (Hex)" name="code" rules={[{ required: true, message: 'Cần mã màu' }]}>
                <Input prefix="#" placeholder="FFFFFF" maxLength={7} onChange={(e) => setColorPickerValue(e.target.value.startsWith('#') ? e.target.value : '#' + e.target.value)} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Tên màu sắc" name="name" rules={[{ required: true, message: 'Cần tên màu' }]}>
                <Input placeholder="Ví dụ: Đỏ Đô" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Trạng thái hoạt động" name="status">
            <Select>
              <Select.Option value="DANG_SU_DUNG">Hoạt động (Đang kinh doanh)</Select.Option>
              <Select.Option value="KHONG_SU_DUNG">Ngừng hoạt động</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddColorModal;