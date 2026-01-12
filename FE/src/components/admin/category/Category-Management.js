import { React, useEffect, useState } from "react";
import "./StyleCategory.css";
import { Button, Input, Select, Space, Table, Tooltip } from "antd";
import { CategoryApi } from "../../../api/admin/category/CategoryApi";
import { useAppDispatch, useAppSelector } from "../../../app/Hook";
import { GetCategory, SetCategory } from "../../../app/reducer/CategoryReducer";
import { BsWrenchAdjustableCircleFill } from "react-icons/bs";
import { BiSolidDetail } from "react-icons/bi";

import ModalCreateCategory from "./modal/CreateModel";
import ModalDetailCategory from "./modal/DetailModal";
import ModalUpdateCategory from "./modal/UpdateModel";


const { Option } = Select;

const CategoryAdmin = () => {

    const [listCategory, setListCategory] = useState([]);
    const dispatch = useAppDispatch();
    const [searchCategory, setSearchCategory] = useState({
        keyword: "",
        status: "",
    });

    const data = useAppSelector(GetCategory);

    useEffect(() => {
        if (data != null) {
            setListCategory(data);
        }
    }, [data]);

    const handleInputChangeSearch = (name, value) => {
        setSearchCategory((prevSearchCategory) => ({
            ...prevSearchCategory,
            [name]: value,
        }));
    };

    const handleKeywordChange = (event) => {
        const { value } = event.target;
        handleInputChangeSearch("keyword", value);
    };

    const handleStatusChange = (value) => {
        handleInputChangeSearch("status", value);
    };

    const handleSubmitSearch = (event) => {
        event.preventDefault();
        CategoryApi.getAllCategories({
            name: searchCategory.keyword,
            status: searchCategory.status,
        }).then((res) => {
            console.log(res.data.data);
            setListCategory(res.data.data);
            dispatch(SetCategory(res.data.data));
        });
    };
    const handleClear = () => {
        setSearchCategory({
            keyword: "",
            status: "",
        });
    };

    const loadTable = () => {
        CategoryApi.getAllCategories().then(
            (response) => {
                setListCategory(response.data.data);
                dispatch(SetCategory(response.data.data));
            }, (err) => {
                console.log("Error", err);
            }
        );
    };

    useEffect(() => {
        loadTable();
    }, []
    );

    const [idUpdate, setIdUpdate] = useState("");
    const [idDetail, setIdDetail] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleUpdate, setModalVisibleUpdate] = useState(false);
    const [modalVisibleDetail, setModalVisibleDetail] = useState(false);

    const handleCancel = () => {
        setModalVisible(false);
        setModalVisibleUpdate(false);
        setModalVisibleDetail(false);
    };

    const listCategoryByStt = listCategory.map((item, index) => ({ ...item, stt: index + 1 }));
    const handleDetail = (id) => {
        setIdDetail(id);
        setModalVisibleDetail(true);
    };

    const handleEdit = (id) => {
        setIdUpdate(id);
        setModalVisibleUpdate(true);
    };

    const getRowClassName = (record, index) => {
        return index % 2 === 0 ? "even-row" : "odd-row";
    };


    const column = [
        {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            align: "center"
        },
        {
            title: "Tên Danh Mục",
            dataIndex: "name",
            key: "name",
            align: "center"
        }
        ,
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
        }
        ,
        {
            title: "Hành Động",
            dataIndex: "action",
            key: "action",
            align: "center",
            render: ( text,record) => (
                <div>
                    <Space size="middle">
                        {/* <Tooltip title="Chi tiết thể loại">
                            <Button onClick={() => handleDetail(record.id)}
                                icon={<BiSolidDetail />} shape="circle" />
                        </Tooltip> */}
                        <Tooltip title="Chỉnh Sửa thể loại">
                            <Button type="primary" ghost onClick={() => handleEdit(record.id)}
                                icon={<BsWrenchAdjustableCircleFill />} shape="circle" />
                        </Tooltip>
                    </Space>
                </div>
            )
        }
    ]

    return (
        <div>
            <div className="category-management-container">
                <span style={{ fontSize: "30px", paddingBottom: "10px", marginBottom: "20px" }}>Quản Lý Danh Mục</span>
            </div>
            <div className="category-management-content">
                {/* <div className="filter">
                    <span style={{ fontSize: "18px", fontWeight: "500", marginRight: "90%" }}>Filter:</span>
                    <div className="content-filter">
                        <div className="content-search">
                            <div className="content-left">
                                Tên Danh Mục :{" "}
                                <Input
                                    placeholder="Search..."
                                    type="text"
                                    name="keyword"
                                    value={searchCategory.keyword}
                                    onChange={handleKeywordChange}
                                    style={{ width: "50%", height: "40px", marginLeft: "10px" }}
                                />
                            </div>
                            <div className="content-right">
                                Trạng Thái :{" "}
                                <Select
                                    defaultValue=""
                                    name="status"
                                    value={searchCategory.status}
                                    onChange={handleStatusChange}
                                    style={{ width: "50%", height: "40px", marginLeft: "10px" }}
                                >
                                    <Option value="" >Tất Cả</Option>
                                    <Option value="DANG_SU_DUNG">Đang Sử Dụng</Option>
                                    <Option value="KHONG_SU_DUNG">Ngừng Sử Dụng</Option>
                                </Select>
                            </div>
                        </div>

                        <div className="content-btn">
                            <Button
                                type="primary"
                                onClick={handleSubmitSearch}
                            >Tìm Kiếm</Button>
                            <Button type="default" style={{ marginLeft: "40px" }}
                                onClick={handleClear}
                            >Reset</Button>
                        </div>


                    </div>
                </div> */}
                <div className="content-table">
                    <div className="content-table-header">
                        <span className="title-table" style={{ fontSize: "18px", fontWeight: "500" }}>
                            Danh Sách Danh Mục
                        </span>

                        <Button
                            type="primary"
                            onClick={() => setModalVisible(true)}
                            style={{
                                backgroundColor: "#1890ff",
                                borderRadius: "5px",
                                height: "40px",
                                width: "120px",
                            }}
                        >
                            Thêm Mới
                        </Button>
                    </div>

                    <div>
                        <Table
                            dataSource={listCategoryByStt}
                            rowKey="id"
                            columns={column}
                            pagination={{ pageSize: 10 }}
                            className="category-table"
                            rowClassName={getRowClassName}
                        />
                    </div>
                    <ModalCreateCategory visible={modalVisible} onCancel={handleCancel} />
                    <ModalUpdateCategory
                        visible={modalVisibleUpdate}
                        id={idUpdate}
                        onCancel={handleCancel}
                    />
                    <ModalDetailCategory
                        visible={modalVisibleDetail}
                        id={idDetail}
                        onCancel={handleCancel}
                    />
                </div>
            </div>
        </div>
    );
}

export default CategoryAdmin;