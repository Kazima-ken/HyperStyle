import React, { useEffect, useState } from "react";
import { Form, Input, Modal } from "antd";
import moment from "moment";
import { CategoryApi } from "../../../../api/admin/category/CategoryApi";

const ModalDetailCategory = ({ visible, id, onCancel }) => {
  const [category, setCategory] = useState({});

  const getOne = () => {
    CategoryApi.getOne(id).then((res) => {
      setCategory(res.data.data);
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
      setCategory(null);
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
          <Input value={category != null ? category.name : null} readOnly />
        </Form.Item>

        <Form.Item label="Trạng thái">
          <Input
            value={
              category != null
                ? category.status == "DANG_SU_DUNG"
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
              category != null
                ? moment(category.createdDate).format("DD-MM-YYYY")
                : null
            }
            readOnly
          />
        </Form.Item>

        <Form.Item label="Ngày cập nhật">
          <Input
            value={
              category != null
                ? moment(category.lastModifiedDate).format("DD-MM-YYYY")
                : null
            }
            readOnly
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalDetailCategory;
