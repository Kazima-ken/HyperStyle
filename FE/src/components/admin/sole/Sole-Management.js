import { React, useEffect, useState } from "react";
import "./StyleSole.css";
import { Button, Input, Select, Space, Table, Tooltip } from "antd";
import { SoleApi } from "../../../api/admin/sole/SoleApi";
import { useAppDispatch, useAppSelector } from "../../../app/Hook";
import { GetSole, SetSole } from "../../../app/reducer/SoleReducer";
import { BsWrenchAdjustableCircleFill } from "react-icons/bs";
import { BiSolidDetail } from "react-icons/bi";

import ModalCreateSole from "./modal/CreateModel";
import ModalDetailSole from "./modal/DetailModal";
import ModalUpdateSole from "./modal/UpdateModel";


const { Option } = Select;

const SoleAdmin = () => {

    const [listSole, setListSole] = useState([]);
    const dispatch = useAppDispatch();
    const [searchSole, setSearchSole] = useState({
        keyword: "",
        status: "",
    });

    const data = useAppSelector(GetSole);

    useEffect(() => {
        if (data != null) {
            setListSole(data);
        }
    }, [data]);

    const handleInputChangeSearch = (name, value) => {
        setSearchSole((prevSearchSole) => ({
            ...prevSearchSole,
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
        SoleApi.getAllsole({
            name: searchSole.keyword,
            status: searchSole.status,
        }).then((res) => {
            console.log(res.data.data);
            setListSole(res.data.data);
            dispatch(SetSole(res.data.data));
        });
    };
    const handleClear = () => {
        setSearchSole({
            keyword: "",
            status: "",
        });
    };

    const loadTable = () => {
        SoleApi.getAllsole().then(
            (response) => {
                setListSole(response.data.data);
                dispatch(SetSole(response.data.data));
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

    const listSoleByStt = listSole.map((item, index) => ({ ...item, stt: index + 1 }));
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
                        <Tooltip title="Chỉnh Sửa đế giày">
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
                <span style={{ fontSize: "30px", paddingBottom: "10px", marginBottom: "20px" }}>Quản Lý Đế Giày</span>
            </div>
            <div className="material-management-content">
                <div className="content-table">
                    <div className="content-table-header">
                        <span className="title-table" style={{ fontSize: "18px", fontWeight: "500" }}>
                            Danh Sách Đế Giày
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
                            dataSource={listSoleByStt}
                            rowKey="id"
                            columns={column}
                            pagination={{ pageSize: 10 }}
                            className="material-table"
                            rowClassName={getRowClassName}
                        />
                    </div>
                    <ModalCreateSole visible={modalVisible} onCancel={handleCancel} />
                    <ModalUpdateSole
                        visible={modalVisibleUpdate}
                        id={idUpdate}
                        onCancel={handleCancel}
                    />
                    <ModalDetailSole
                        visible={modalVisibleDetail}
                        id={idDetail}
                        onCancel={handleCancel}
                    />
                </div>
            </div>
        </div >
    );
}

export default SoleAdmin;