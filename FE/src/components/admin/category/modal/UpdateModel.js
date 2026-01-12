import React, { useEffect } from "react";
import { Modal, Input, Select, Button, Form, message } from "antd";
import { useAppDispatch } from "../../../../app/Hook";

import { CategoryApi } from "../../../../api/admin/category/CategoryApi";
import { UpdateCategory } from "../../../../app/reducer/CategoryReducer"; // Bạn cần đảm bảo đã có action này trong Reducer

const { Option } = Select;

const ModalUpdateCategory = ({ visible, id, onCancel }) => {
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (visible && id) {
            CategoryApi.getOne(id).then((res) => {
                form.setFieldsValue(res.data.data);
            }).catch((err) => {
                console.log(err);
                message.error("Không tải được dữ liệu danh mục");
            });
        }
    }, [visible, id, form]);

    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                const trimmedValues = Object.keys(values).reduce((acc, key) => {
                    acc[key] = typeof values[key] === "string" ? values[key].trim() : values[key];
                    return acc;
                }, {});

                return new Promise((resolve, reject) => {
                    Modal.confirm({
                        title: "Xác nhận",
                        content: "Bạn có chắc chắn muốn cập nhật không?",
                        okText: "Đồng ý",
                        cancelText: "Hủy",
                        onOk: () => resolve(trimmedValues),
                        onCancel: () => reject(),
                    });
                });
            })
            .then((trimmedValues) => {
                CategoryApi.updateCategory(id, trimmedValues)
                    .then((res) => {
                        dispatch(UpdateCategory(res.data.data));
                        message.success("Cập nhật thành công");
                        onCancel();
                    })
                    .catch((error) => {
                        const errorMsg = error.response?.data?.message || "Cập nhật thất bại";
                        message.error(errorMsg);
                    });
            })
            .catch(() => {
            });
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            title="Cập nhật thể loại"
            open={visible}
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
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Tên thể loại"
                    name="name"
                    rules={[
                        { required: true, message: "Vui lòng nhập tên thể loại" },
                        { max: 50, message: "Tên thể loại tối đa 50 ký tự" },
                        {
                            validator: (_, value) => {
                                if (value && value.trim() === "") {
                                    return Promise.reject("Không được chỉ nhập khoảng trắng");
                                }
                                if (!/^(?=.*[a-zA-Z]|[À-ỹ])[a-zA-Z\dÀ-ỹ\s\-_]*$/.test(value)) {
                                    return Promise.reject(
                                        "Phải chứa ít nhất một chữ cái và không có ký tự đặc biệt"
                                    );
                                }
                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    <Input placeholder="Tên thể loại" />
                </Form.Item>

                <Form.Item
                    label="Trạng thái"
                    name="status"
                    rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
                >
                    <Select>
                        <Option value="DANG_SU_DUNG">Đang sử dụng</Option>
                        <Option value="KHONG_SU_DUNG">Ngừng sử dụng</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalUpdateCategory;