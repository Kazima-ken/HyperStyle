import React, { useEffect, useState } from "react";
import { Modal, Input, Select, Button, Form, message } from "antd";
import { useAppDispatch } from "../../../../app/Hook";

import "react-toastify/dist/ReactToastify.css";
import { SoleApi } from "../../../../api/admin/sole/SoleApi";
import { UpdateSole } from "../../../../app/reducer/SoleReducer";

const { Option } = Select;

const ModalUpdateSole = ({ visible, id, onCancel }) => {
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();
    const getOne = () => {
        SoleApi.getOne(id).then((res) => {
            form.setFieldsValue(res.data.data);
        });
    };

    useEffect(() => {
        if (visible && id) {
            SoleApi.getOne(id).then((res) => {
                form.setFieldsValue(res.data.data);
            });
        }

        if (!visible) {
            form.resetFields();
        }
    }, [id, visible]);


    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                const trimmedValues = Object.keys(values).reduce((acc, key) => {
                    acc[key] =
                        typeof values[key] === "string" ? values[key].trim() : values[key];
                    return acc;
                }, {});
                return new Promise((resolve, reject) => {
                    Modal.confirm({
                        title: "Xác nhận",
                        content: "Bạn có đồng ý cập nhật không?",
                        okText: "Đồng ý",
                        cancelText: "Hủy",
                        onOk: () => resolve(trimmedValues),
                        onCancel: () => reject(),
                    });
                });
            })
            .then((trimmedValues) => {
                SoleApi.updatesole(id, trimmedValues)
                    .then((res) => {
                        dispatch(UpdateSole(res.data.data));
                        message.success("Cập nhật thành công");
                        onCancel();
                        form.resetFields();
                    })
                    .catch((error) => {
                        console.log("Create failed:", error);
                    });
            });
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            title="Cập nhật đế giày "
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
                    label="Tên đế giày"
                    name="name"
                    rules={[
                        { required: true, message: "Vui lòng nhập tên đế giày" },
                        { max: 50, message: "Tên đế giày tối đa 50 ký tự" },
                        {
                            validator: (_, value) => {
                                // Kiểm tra xem giá trị chỉ chứa khoảng trắng
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
                    <Input
                        placeholder="Tên đế giày"
                        onKeyDown={(e) => {
                            if (e.target.value === "" && e.key === " ") {
                                e.preventDefault();
                                e.target.value.replace(/\s/g, "");
                            }
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label="Trạng thái"
                    name="status"
                    rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
                >
                    <Select placeholder=" Vui lòng chọn trạng thái ">
                        <Option value="DANG_SU_DUNG">Đang sử dụng</Option>
                        <Option value="KHONG_SU_DUNG">Không sử dụng</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalUpdateSole;
