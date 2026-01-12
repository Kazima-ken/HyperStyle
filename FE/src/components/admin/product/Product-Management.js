import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Space, Tag, Image, Tooltip, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { ProductApi } from '../../../api/admin/product/ProductApi';
import { BiSolidDetail } from 'react-icons/bi';
import { BsWrenchAdjustableCircleFill } from 'react-icons/bs'; import { use } from 'react';
import { useNavigate } from 'react-router';
import ModalDetailProductManagment from "./ModalDetailProductManagment";
;

const ProductManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const [listProduct, setListProduct] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modaleDetail, setModalDetail] = useState(false);
    const [productDetailId, setProductDetaiId] = useState(null);

    const navigate = useNavigate();

    const loadTable = () => {
        setLoading(true);
        ProductApi.getAll({}).then(
            (response) => {
                const dataFromServer = response.data?.data;

                console.log("Dữ liệu nhận được:", dataFromServer);

                if (Array.isArray(dataFromServer)) {
                    setListProduct(dataFromServer);
                } else {
                    if (dataFromServer?.content && Array.isArray(dataFromServer.content)) {
                        setListProduct(dataFromServer.content);
                    } else {
                        setListProduct([]);
                    }
                }
                setLoading(false);
            },
            (err) => {
                console.log("Lỗi khi tải dữ liệu", err);
                message.error("Không thể tải danh sách sản phẩm");
                setListProduct([]);
                setLoading(false);
            }
        );
    };

    useEffect(() => {
        loadTable();
    }, []);


    const handleCancel = () => {
        setModalDetail(false);
    };

    const handleViewDetail = (id) => {
        setModalDetail(true);
        setProductDetaiId(id);
    };

    const handleUpdate = (id) => {
    if (!id) return; // Chặn nếu ID rỗng
    navigate(`/product-detail-management/${id}`);
};

    const columns = [
        {
            title: 'STT',
            key: 'index',
            width: 60,
            align: 'center',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Mã SP',
            dataIndex: 'code',
            key: 'code',
            fontWeight: 'bold',
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <b>{text}</b>,
        },
        {
            title: 'Ảnh',
            dataIndex: 'image',
            key: 'image',
            align: 'center',
            render: (url) => (
                <Image
                    width={50}
                    src={url || "https://via.placeholder.com/50"}
                    alt="product"
                    style={{ borderRadius: '4px', objectFit: 'cover' }}
                />
            ),
        },
        {
            title: "Số Lượng Tồn",
            dataIndex: "totalQuantity",
            key: "totalQuantity",
            sorter: (a, b) => a.totalQuantity - b.totalQuantity,
            align: "center",
        },
        {
            title: "Trạng Thái",
            dataIndex: "status",
            key: "status",
            align: "center",
            render: (text) => {
                const status = text === "DANG_SU_DUNG" ?
                    "Đang Sử Dụng" : text === "KHONG_SU_DUNG" ?
                        "Ngừng Sử Dụng" : "Chưa Kích Hoạt";
                return <span style={{
                    color: text === "DANG_SU_DUNG" ? "green" :
                        text === "KHONG_SU_DUNG" ? "red" : "orange", background: text === "DANG_SU_DUNG" ? "lightgreen" :
                            text === "KHONG_SU_DUNG" ? "lightcoral" : "lightgoldenrodyellow",
                    border: "1px solid", borderRadius: "20px", padding: "7px"
                }}>{status}</span>;
            }
        },
        {
    title: 'Hành động',
    key: 'action',
    render: (_, record) => {
        // Log ra xem dòng nào bị lỗi record
        // console.log("Record:", record); 
        
        return (
            <Space size="middle">
                <Tooltip title="Chi tiết">
                    <Button 
                        icon={<BiSolidDetail />} 
                        shape="circle"
                        // Thêm dấu ?. để an toàn
                        onClick={() => handleViewDetail(record?.id)}
                    />
                </Tooltip>
                
                <Tooltip title="Sửa">
                    <Button 
                        type="primary" 
                        ghost 
                        icon={<BsWrenchAdjustableCircleFill />} 
                        shape="circle"
                        // SỬA Ở ĐÂY: Thêm kiểm tra an toàn
                        onClick={() => {
                            if (record && record.id) {
                                handleUpdate(record.id);
                            } else {
                                console.error("Lỗi: Dòng này không có ID", record);
                            }
                        }}
                    />
                </Tooltip>
            </Space>
        );
    },
}
    ];

    const showModal = () => setIsModalOpen(true);

    const handleOpenAdd = () => {
        navigate('/create-product-management');
        console.log("Navigate to create product page");
    };

    return (
        <div className="product-management">
            <div className="category-management-container">
                <span style={{ fontSize: "30px", paddingBottom: "10px", marginBottom: "20px" }}>Quản Lý Danh Mục</span>
            </div>
            <div className="table-management">

                <div className="content-table-header">
                    <span className="title-table" style={{ fontSize: "18px", fontWeight: "500" }}>
                        Danh Sách Danh Mục
                    </span>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAdd} style={{
                        marginBottom: 16,
                        backgroundColor: "#1890ff",
                        borderRadius: "5px",
                        height: "40px",
                        width: "120px",
                    }}>
                        Thêm sản phẩm
                    </Button>
                </div>
                <div>
                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={listProduct}
                        loading={loading}
                        bordered
                        pagination={{ pageSize: 5 }}
                    />
                </div>
                <ModalDetailProductManagment
                    visible={modaleDetail}
                    onCancel={handleCancel}
                    id={productDetailId}
                />
            </div>
        </div>
    );
};

export default ProductManagement;