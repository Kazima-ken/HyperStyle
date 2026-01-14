import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col, Input, message, Divider, Empty } from "antd";
import "./style-addSize.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { SizeApi } from "../../../../api/admin/size/SizeApi";
import { useAppDispatch } from "../../../../app/Hook";
import { SetSize } from "../../../../app/reducer/SizeReducer";

const ModalAddListSizeProduct = ({ visible, onCancel, onSaveData }) => {
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [listSize, setListSize] = useState([]);
  const [isAddSizeModalVisible, setAddSizeModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const dispatch = useAppDispatch();

  // Lấy danh sách và sắp xếp theo số
  const getList = async () => {
    try {
      const res = await SizeApi.getAllSize();
      const sortedData = res.data.data.sort((a, b) => Number(a.name) - Number(b.name));
      setListSize(sortedData);
      dispatch(SetSize(sortedData));
    } catch (error) {
      console.error("Lấy danh sách size thất bại:", error);
    }
  };

  useEffect(() => {
    if (visible) getList();
  }, [visible]);

  const handleOkAddSize = async () => {
    const sizeNum = Number(inputValue);
    if (!inputValue) {
      message.error("Vui lòng nhập kích cỡ");
      return;
    }
    if (sizeNum <= 30 || sizeNum >= 60) {
      message.error("Kích cỡ phải từ 31 đến 59");
      return;
    }

    try {
      await SizeApi.createSize({ name: inputValue, status: "DANG_SU_DUNG" });
      message.success("Thêm kích cỡ mới thành công");
      setInputValue("");
      setAddSizeModalVisible(false);
      getList();
    } catch (error) {
      message.error(error.response?.data?.message || "Kích cỡ đã tồn tại");
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (value !== "" && !/^\d+$/.test(value)) return;
    if (Number(value) >= 60) {
      message.warning("Kích cỡ phải nhỏ hơn 60");
      return;
    }
    setInputValue(value);
  };

  const handleOk = () => {
    if (selectedSizes.length === 0) {
      message.warning("Vui lòng chọn ít nhất một kích cỡ");
      return;
    }
    const selectedSizeData = selectedSizes.map((size) => ({
      id: size.id,
      nameSize: size.name,
    }));
    onSaveData(selectedSizeData);
    setSelectedSizes([]);
    onCancel();
  };

  const toggleSizeSelection = (size) => {
    setSelectedSizes((prev) =>
      prev.find(item => item.id === size.id)
        ? prev.filter((item) => item.id !== size.id)
        : [...prev, size]
    );
  };

  return (
    <>
      <Modal
        title={<span style={{ fontWeight: 700, fontSize: '18px' }}>Chọn kích cỡ sản phẩm</span>}
        open={visible}
        onOk={handleOk}
        onCancel={onCancel}
        okText="Xác nhận"
        cancelText="Hủy bỏ"
        width={600}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ color: '#8c8c8c' }}>
            Đã chọn: <b style={{ color: '#1890ff' }}>{selectedSizes.length}</b> kích cỡ
          </span>
          <Button
            type="primary"
            ghost
            onClick={() => setAddSizeModalVisible(true)}
            icon={<FontAwesomeIcon icon={faPlus} style={{ marginRight: 8 }} />}
          >
            Thêm kích thước mới
          </Button>
        </div>

        <div className="size-list-container">
          {listSize.length > 0 ? (
            <Row gutter={[12, 12]}>
              {listSize.map((size) => {
                const isSelected = selectedSizes.find(item => item.id === size.id);
                return (
                  <Col key={size.id} span={6}>
                    <Button
                      block
                      className={`size-button ${isSelected ? "selected" : ""}`}
                      onClick={() => toggleSizeSelection(size)}
                    >
                      {size.name}
                      {isSelected && <FontAwesomeIcon icon={faCheckCircle} style={{ marginLeft: 6, fontSize: '12px' }} />}
                    </Button>
                  </Col>
                );
              })}
            </Row>
          ) : (
            <Empty description="Chưa có dữ liệu kích cỡ" />
          )}
        </div>
      </Modal>

      {/* Modal nhỏ để thêm mới */}
      <Modal
        title="Tạo kích cỡ mới"
        open={isAddSizeModalVisible}
        onOk={handleOkAddSize}
        onCancel={() => { setAddSizeModalVisible(false); setInputValue(""); }}
        width={400}
        centered
      >
        <div style={{ padding: '10px 0' }}>
          <p style={{ marginBottom: 8, fontWeight: 500 }}>Nhập số (Khoảng 31 - 59):</p>
          <Input
            size="large"
            placeholder="Ví dụ: 40"
            value={inputValue}
            onChange={handleChange}
            suffix="Size"
          />
        </div>
      </Modal>
    </>
  );
};

export default ModalAddListSizeProduct;