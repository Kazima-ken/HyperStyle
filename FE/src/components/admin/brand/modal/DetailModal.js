import React, { useEffect, useState } from "react";
import { Form, Input, Modal } from "antd";
import moment from "moment";
import { BrandApi } from "../../../../api/admin/brand/BrandApi";

const ModalDetailBrand = ({ visible, id, onCancel }) => {
  const [brand, setBrand] = useState({});

  const getOne = () => {
    BrandApi.getOne(id).then((res) => {
      setBrand(res.data.data);
    });
  };
  const handleCancel = () => {
    onCancel();
  };

  useEffect(() => {
    console.log(id);
    if (id != null && id !== "") {
      getOne();
    }
    return () => {
      setBrand(null);
      id = null;
    };
  }, [id, visible]);

  return (
    <Modal
      title="Chi tiết thể loại"
      open={visible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form layout="vertical">
        <Form.Item label="Tên thể loại">
          <Input value={brand != null ? brand.name : null} readOnly />
        </Form.Item>

        <Form.Item label="Trạng thái">
          <Input
            value={
              brand != null
                ? brand.status == "DANG_SU_DUNG"
                  ? "Đang sử dụng"
                  : "Không sử dụng"
                : null
            }
            readOnly
          />
        </Form.Item>

        <Form.Item label="Ngày tạo">
          <Input
            value={
              brand != null
                ? moment(brand.createdDate).format("DD-MM-YYYY")
                : null
            }
            readOnly
          />
        </Form.Item>

        <Form.Item label="Ngày cập nhật">
          <Input
            value={
              brand != null
                ? moment(brand.lastModifiedDate).format("DD-MM-YYYY")
                : null
            }
            readOnly
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalDetailBrand;
