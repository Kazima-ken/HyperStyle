import { React, useEffect, useState } from "react";
import "./StyleBrand.css";
import { Button, Input, Select, Space, Table, Tooltip } from "antd";
import { BrandApi } from "../../../api/admin/brand/BrandApi";
import { useAppDispatch, useAppSelector } from "../../../app/Hook";
import { GetBrand, SetBrand } from "../../../app/reducer/BrandReducer";
import { BsWrenchAdjustableCircleFill } from "react-icons/bs";
import { BiSolidDetail } from "react-icons/bi";

import ModalCreateBrand from "./modal/CreateModel";
import ModalDetailBrand from "./modal/DetailModal";
import ModalUpdateBrand from "./modal/UpdateModel";


const { Option } = Select;

const BrandAdmin = () => {

    const [listBrand, setListBrand] = useState([]);
    const dispatch = useAppDispatch();
    const [searchBrand, setSearchBrand] = useState({
        keyword: "",
        status: "",
    });

    const data = useAppSelector(GetBrand);

    useEffect(() => {
        if (data != null) {
            setListBrand(data);
        }
    }, [data]);

    const handleInputChangeSearch = (name, value) => {
        setSearchBrand((prevSearchBrand) => ({
            ...prevSearchBrand,
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
        BrandApi.getAllBrand({
            name: searchBrand.keyword,
            status: searchBrand.status,
        }).then((res) => {
            console.log(res.data.data);
            setListBrand(res.data.data);
            dispatch(SetBrand(res.data.data));
        });
    };
    const handleClear = () => {
        setSearchBrand({
            keyword: "",
            status: "",
        });
    };

    const loadTable = () => {
        BrandApi.getAllBrand().then(
            (response) => {
                setListBrand(response.data.data);
                dispatch(SetBrand(response.data.data));
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

    const listBrandByStt = listBrand.map((item, index) => ({ ...item, stt: index + 1 }));
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
            render: (text, record) => (
                <div>
                    <Space size="middle">
                        {/* <Tooltip title="Chi tiết thương hiệu">
                            <Button onClick={() => handleDetail(record.id)}
                                icon={<BiSolidDetail />} shape="circle" />
                        </Tooltip> */}
                        <Tooltip title="Chỉnh Sửa thương hiệu">
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
            <div className="brand-management-container">
                <span style={{ fontSize: "30px", paddingBottom: "10px", marginBottom: "20px" }}>Quản Lý Thương Hiệu</span>
            </div>
            <div className="brand-management-content">
                {/* <div className="filter">
                    <span style={{ fontSize: "18px", fontWeight: "500", marginRight: "90%" }}>Filter:</span>
                    <div className="content-filter">
                        <div className="content-search">
                            <div className="content-left">
                                Tên Thương Hiệu :{" "}
                                <Input
                                    placeholder="Search..."
                                    type="text"
                                    name="keyword"
                                    value={searchBrand.keyword}
                                    onChange={handleKeywordChange}
                                    style={{ width: "50%", height: "40px", marginLeft: "10px" }}
                                />
                            </div>
                            <div className="content-right">
                                Trạng Thái :{" "}
                                <Select
                                    defaultValue=""
                                    name="status"
                                    value={searchBrand.status}
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
                            Danh Sách Thương Hiệu
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
                            dataSource={listBrandByStt}
                            rowKey="id"
                            columns={column}
                            pagination={{ pageSize: 10 }}
                            className="brand-table"
                            rowClassName={getRowClassName}
                        />
                    </div>
                    <ModalCreateBrand visible={modalVisible} onCancel={handleCancel} />
                    <ModalUpdateBrand
                        visible={modalVisibleUpdate}
                        id={idUpdate}
                        onCancel={handleCancel}
                    />
                    <ModalDetailBrand
                        visible={modalVisibleDetail}
                        id={idDetail}
                        onCancel={handleCancel}
                    />
                </div>
            </div>
        </div >
    );
}

export default BrandAdmin;