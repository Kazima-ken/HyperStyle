import { React, useEffect, useState } from "react";
import "./StyleMaterial.css";
import { Button, Input, Select, Space, Table, Tooltip } from "antd";
import { MaterialApi } from "../../../api/admin/material/MaterialApi";
import { useAppDispatch, useAppSelector } from "../../../app/Hook";
import { GetMaterial, SetMaterial } from "../../../app/reducer/MaterialReducer";
import { BsWrenchAdjustableCircleFill } from "react-icons/bs";
import { BiSolidDetail } from "react-icons/bi";

import ModalCreateMaterial from "./modal/CreateModel";
import ModalDetailMaterial from "./modal/DetailModal";
import ModalUpdateMaterial from "./modal/UpdateModel";


const { Option } = Select;

const MaterialAdmin = () => {

    const [listMaterial, setListMaterial] = useState([]);
    const dispatch = useAppDispatch();
    const [searchMaterial, setSearchMaterial] = useState({
        keyword: "",
        status: "",
    });

    const data = useAppSelector(GetMaterial);

    useEffect(() => {
        if (data != null) {
            setListMaterial(data);
        }
    }, [data]);

    const handleInputChangeSearch = (name, value) => {
        setSearchMaterial((prevSearchMaterial) => ({
            ...prevSearchMaterial,
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
        MaterialApi.getAllMaterial({
            name: searchMaterial.keyword,
            status: searchMaterial.status,
        }).then((res) => {
            console.log(res.data.data);
            setListMaterial(res.data.data);
            dispatch(SetMaterial(res.data.data));
        });
    };
    const handleClear = () => {
        setSearchMaterial({
            keyword: "",
            status: "",
        });
    };

    const loadTable = () => {
        MaterialApi.getAllMaterial().then(
            (response) => {
                setListMaterial(response.data.data);
                dispatch(SetMaterial(response.data.data));
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

    const listMaterialByStt = listMaterial.map((item, index) => ({ ...item, stt: index + 1 }));
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
                        {/* <Tooltip title="Chi tiết chất liệu">
                            <Button onClick={() => handleDetail(record.id)}
                                icon={<BiSolidDetail />} shape="circle" />
                        </Tooltip> */}
                        <Tooltip title="Chỉnh Sửa chất liệu">
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
            <div className="material-management-container">
                <span style={{ fontSize: "30px", paddingBottom: "10px", marginBottom: "20px" }}>Quản Lý Chất Liệu</span>
            </div>
            <div className="material-management-content">
                {/* <div className="filter">
                    <span style={{ fontSize: "18px", fontWeight: "500", marginRight: "90%" }}>Filter:</span>
                    <div className="content-filter">
                        <div className="content-search">
                            <div className="content-left">
                                Tên Chất Liêu :{" "}
                                <Input
                                    placeholder="Search..."
                                    type="text"
                                    name="keyword"
                                    value={searchMaterial.keyword}
                                    onChange={handleKeywordChange}
                                    style={{ width: "50%", height: "40px", marginLeft: "10px" }}
                                />
                            </div>
                            <div className="content-right">
                                Trạng Thái :{" "}
                                <Select
                                    defaultValue=""
                                    name="status"
                                    value={searchMaterial.status}
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
                            Danh Sách Chất Liêu
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
                            dataSource={listMaterialByStt}
                            rowKey="id"
                            columns={column}
                            pagination={{ pageSize: 10 }}
                            className="material-table"
                            rowClassName={getRowClassName}
                        />
                    </div>
                    <ModalCreateMaterial visible={modalVisible} onCancel={handleCancel} />
                    <ModalUpdateMaterial
                        visible={modalVisibleUpdate}
                        id={idUpdate}
                        onCancel={handleCancel}
                    />
                    <ModalDetailMaterial
                        visible={modalVisibleDetail}
                        id={idDetail}
                        onCancel={handleCancel}
                    />
                </div>
            </div>
        </div >
    );
}

export default MaterialAdmin;