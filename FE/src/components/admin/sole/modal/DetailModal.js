import React, { useEffect, useState } from "react";
import { Form, Input, Modal } from "antd";
import moment from "moment";
import { SoleApi } from "../../../../api/admin/sole/SoleApi";

const ModalDetailSole = ({ visible, id, onCancel }) => {
  const [sole, setSole] = useState({});

  const getOne = () => {
    SoleApi.getOne(id).then((res) => {
      setSole(res.data.data);
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
      setSole(null);
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
          <Input value={sole != null ? sole.name : null} readOnly />
        </Form.Item>

        <Form.Item label="Trạng thái">
          <Input
            value={
              sole != null
                ? sole.status == "DANG_SU_DUNG"
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

export default ModalDetailSole;
