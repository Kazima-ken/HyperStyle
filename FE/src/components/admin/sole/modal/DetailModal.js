import React, { useEffect, useState } from "react";
import { Form, Input, Modal } from "antd";
import moment from "moment";
import { MaterialApi } from "../../../../api/admin/material/MaterialApi";

const ModalDetailMaterial = ({ visible, id, onCancel }) => {
  const [material, setMaterial] = useState({});

  const getOne = () => {
    MaterialApi.getOne(id).then((res) => {
      setMaterial(res.data.data);
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
      setMaterial(null);
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
          <Input value={material != null ? material.name : null} readOnly />
        </Form.Item>

        <Form.Item label="Trạng thái">
          <Input
            value={
              material != null
                ? material.status == "DANG_SU_DUNG"
                  ? "Đang sử dụng"
                  : "Không sử dụng"
                : null
            }
            readOnly
          />
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default ModalDetailMaterial;
