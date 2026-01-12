import { Option } from "antd/es/mentions";
import "./style-product.css";
import { AutoComplete, Button, Card, Col, Divider, Form, Input, InputNumber, message, Modal, Row, Select, Space, Steps, Table, Tag, Tooltip, Upload, } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleMinus, faPlus, faTrash, } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { MaterialApi } from "../../../api/admin/material/MaterialApi";
import { CategoryApi } from "../../../api/admin/category/CategoryApi";
import { SoleApi } from "../../../api/admin/sole/SoleApi";
import { BrandApi } from "../../../api/admin/brand/BrandApi";
import { useAppDispatch, useAppSelector } from "../../../app/Hook";
import { GetSole, SetSole } from "../../../app/reducer/SoleReducer";
import { GetMaterial, SetMaterial, } from "../../../app/reducer/MaterialReducer";
import { GetCategory, SetCategory, } from "../../../app/reducer/CategoryReducer";
import { GetBrand, SetBrand } from "../../../app/reducer/BrandReducer";
import { ProductApi } from "../../../api/admin/product/ProductApi";
import { PlusOutlined } from "@ant-design/icons";
import convert from "color-convert";
import ModalAddListSizeProduct from "./modal/ModalAddListSizeProduct";
import AddColorModal from "./modal/ModalAddListColor";
import { useNavigate } from "react-router-dom";
import useDebounce from "../../../app/useDebounce";
import { ProductDetailApi } from "../../../api/admin/productDetail/productDetailApi";
import { SizeApi } from "../../../api/admin/size/SizeApi";
import { ColorApi } from "../../../api/admin/color/ColorApi";
const CreateProductManagment = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const status = "DANG_SU_DUNG";
    const [form] = Form.useForm();
    const [modalAddColor, setModalAddColor] = useState(false);
    const [modalAddSize, setModalAddSize] = useState(false);
    const dataSole = useAppSelector(GetSole);
    const dataCategory = useAppSelector(GetCategory);
    const dataMaterial = useAppSelector(GetMaterial);
    const dataBrand = useAppSelector(GetBrand);
    const [storedValues, setStoredValues] = useState({});

    const initialValues = {
        status: "DANG_SU_DUNG"
    };

    const dataGender = [
        { id: "NAM", name: "Nam" },
        { id: "NU", name: "Nữ" },
        { id: "NAM_VA_NU", name: "Nam và Nữ" }
    ];

    const handleCancel = () => {
        setModalAddColor(false);
        setModalAddSize(false);
    };
    const [listProduct, setListProduct] = useState([]);
    const getList = () => {
        ProductApi.getAllName().then((res) => {
            setListProduct(res.data.data);
        });
        MaterialApi.getAllMaterial({
            status: status,
        }).then((res) => {
            dispatch(SetMaterial(res.data.data));
        });
        CategoryApi.getAllCategories({
            status: status,
        }).then((res) => {
            dispatch(SetCategory(res.data.data));
        });
        SoleApi.getAllsole({
            status: status,
        }).then((res) => {
            dispatch(SetSole(res.data.data));
        });
        BrandApi.getAllBrand({
            status: status,
        }).then((res) => {
            dispatch(SetBrand(res.data.data));
        });
    };
    const handleSearch = (value) => {
        setValueInput(value);
    };

    console.log("Data: ", dataBrand);
    const generateProductCode = () => {
        const randomNumber = Math.floor(
            Math.random() * 10 ** 15
        ).toString().padStart(15, "0");

        return `SP${randomNumber}`;
    };

    const [valueInput, setValueInput] = useState("");

    const debouncedNameValue = useDebounce(valueInput, 700);

    useEffect(() => {
        ProductApi.getAllName({
            name: valueInput,
        }).then((res) => {
            setListProduct(res.data.data);
        });
    }, [debouncedNameValue]);

    const [listSizeAdd, setListSizeAdd] = useState([]);

    const handleSaveData = (selectedSizeData) => {
        console.log(selectedSizeData);
        selectedSizeData.forEach((selectedSizeData) => {
            const existingSize = listSizeAdd.find(
                (item) => item.nameSize === selectedSizeData.size
            );
            if (existingSize) {
                message.warning(
                    `Kích cỡ ${selectedSizeData.size} đã tồn tại trong danh sách!`
                );
            } else {
                setListSizeAdd((prevList) => [
                    ...prevList,
                    {
                        nameSize: selectedSizeData.size,
                    },
                ]);
            }
        });
    };
    const [listColorAdd, setListColorAdd] = useState([]);
    const getColorName = (colorCode) => {
        const hexCode = colorCode.replace("#", "").toUpperCase();
        const rgb = convert.hex.rgb(hexCode);
        const colorName = convert.rgb.keyword(rgb);

        if (colorName === null) {
            return "Unknown";
        } else {
            return colorName;
        }
    };
    const handleSaveDataColor = (color) => {
        color.forEach((color) => {
            const existingSize = listColorAdd.find((item) => item.color === color);
            if (existingSize) {
                message.warning(
                    `Màu đã ${getColorName(color)} đã tồn tại trong danh sách!`
                );
            } else {
                setListColorAdd((prevList) => [
                    ...prevList,
                    {
                        color: color,
                    },
                ]);
            }
        });
        setModalAddColor(false);
    };
    const handleDeleteSize = (e, index, nameSize) => {
        e.preventDefault(); // 🚨 CỰC KỲ QUAN TRỌNG

        Modal.confirm({
            title: "Xác nhận xóa",
            content: "Bạn có chắc chắn muốn xóa kích cỡ " + nameSize + " không?",
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            onOk() {
                const updatedList = [...listSizeAdd];
                updatedList.splice(index, 1);
                setListSizeAdd(updatedList);
                message.success("Đã xóa kích cỡ thành công");
            },
        });
    };

    const handleDeleteColor = (e, index, color) => {
        e.preventDefault(); // 🚨 CHẶN auto close của Tag

        Modal.confirm({
            title: "Xác nhận xóa",
            content: "Bạn có chắc chắn muốn xóa màu " + color + " không?",
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            onOk() {
                const updatedList = [...listColorAdd];
                updatedList.splice(index, 1);
                setListColorAdd(updatedList);
                message.success("Đã xóa màu thành công");
            },
        });
    };


    const handleUpload = async () => {
        try {
            const allValues = form.getFieldsValue(true);

            Modal.confirm({
                title: "Xác nhận",
                content: "Bạn có đồng ý thêm sản phẩm này không?",
                okText: "Đồng ý",
                cancelText: "Hủy",
                onOk: async () => {
                    await submitProduct(allValues);
                },
            });
        } catch (error) {
            console.error("Lỗi handleUpload:", error);
        }
    };



    const submitProduct = async (allValues) => {
        if (!listSizeAdd || listSizeAdd.length === 0) {
            message.error("Cần thêm ít nhất một kích thước");
            return;
        }
        if (!listColorAdd || listColorAdd.length === 0) {
            message.error("Cần thêm ít nhất một màu sắc");
            return;
        }
        if (!allValues.name || !allValues.name.trim()) {
            message.error("Tên sản phẩm không được để trống");
            return;
        }

        try {
            let avatarFile = null;
            if (listColorAndFileData?.length > 0) {
                const firstColorGroup = listColorAndFileData[0];
                if (firstColorGroup.fileData?.length > 0) {
                    avatarFile = firstColorGroup.fileData[0].originFileObj;
                }
            }

            const productFormData = new FormData();
            const productRequest = {
                code: generateProductCode(),
                name: allValues.name,
                status: allValues.status || "DANG_SU_DUNG",
                brandId: allValues.brandId,
                materialId: allValues.materialId,
                soleId: allValues.soleId,
                categoryId: allValues.categoryId,
            };

            productFormData.append("request", JSON.stringify(productRequest));
            if (avatarFile) {
                productFormData.append("file", avatarFile);
            }

            const createProductResponse = await ProductApi.create(productFormData);

            const newProductId = createProductResponse.data.data.id;

            for (const row of tableData) {

                const currentQuantity = row.quantity || 1;

                const currentPrice = row.price ? Number(row.price) : 0;

                const cleanColorCode = row.color.replace("#", "");

                const [sizeResponse, colorResponse] = await Promise.all([
                    SizeApi.getOneByName(row.size),
                    ColorApi.getOneByColorCode(cleanColorCode)
                ]);

                const sizeData = sizeResponse.data.data;
                const colorData = colorResponse.data.data;

                if (!sizeData || !colorData) {
                    message.error(`Lỗi dữ liệu: Không tìm thấy Size ${row.size} hoặc Màu ${row.color}`);
                    return;
                }

                // 3. Tạo request chi tiết
                const productDetailRequest = {
                    productId: newProductId,
                    sizeId: sizeData.id,
                    colorId: colorData.id,
                    description: allValues.description,
                    gender: allValues.gender,
                    status: "DANG_SU_DUNG",

                    // --- QUAN TRỌNG: Lấy dữ liệu từ dòng trong bảng ---
                    quantity: currentQuantity,
                    price: currentPrice
                };

                console.log("Đang thêm chi tiết:", productDetailRequest);
                await ProductDetailApi.addListProduct(productDetailRequest);
            }

            message.success("Thêm sản phẩm và biến thể thành công!");
            navigate("/product-management");

        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || "Đã xảy ra lỗi không xác định";
            message.error("Lỗi: " + msg);
        }
    };




    useEffect(() => {
        getList();
    }, []);

    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            width: "7%",
            sorter: (a, b) => a.stt - b.stt,
        },
        {
            title: <div style={{ textAlign: "center" }}>Tên Sản Phẩm</div>,
            dataIndex: "productId",
            key: "productId",
            width: "30%",
            render: (productId, record) =>
                `${productId} [ ${record.size} - ${getColorName(record.color)} ]`,
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
            align: "center",
            width: "10%",
            render: (_, record) => (
                <InputNumber
                    min={1}
                    value={record.quantity}
                    onChange={(value) => handleQuantityChange(value, record.key)} />),
        }, {
            title: "Giá Bán",
            dataIndex: "price",
            key: "price",
            align: "center",
            width: "15%",
            render: (_, record) => (
                <InputNumber
                    min={100000}
                    style={{ width: "100%" }}
                    value={record.price}
                    formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                    }
                    parser={(value) => value.replace(/\./g, "")}
                    onChange={(value) => {
                        handlePriceChange(value, record.key);
                    }}
                />
            ),
        }, {
            title: "Hành động",
            dataIndex: "action",
            key: "action",
            width: "5%",
            render: (text, record) => (
                <Space size="middle">
                    <Tooltip title="Xóa chi tiết">
                        <Button onClick={() => handleDelete(record)} type="danger">
                            <FontAwesomeIcon
                                icon={faTrash}
                                style={{ fontSize: "20px", color: "red" }}
                            />
                        </Button>
                    </Tooltip>
                </Space>),
        },
        {
            title: <div style={{ textAlign: "center" }}>Upload Ảnh</div>,
            dataIndex: "color",
            key: "color",

            render: (color, record, index) => {
                const rowsWithSameColor = tableData.filter(
                    (item) => item.color === record.color
                );

                if (index > 0 && record.color === tableData[index - 1].color) {
                    return null;
                }

                const colorFileData =
                    listColorAndFileData.find((item) => item.color === record.color)
                        ?.fileData || [];

                return (
                    <Upload
                        listType="picture-card"
                        fileList={colorFileData}
                        accept="image/*"
                        onPreview={handlePreview}
                        onChange={(info) => handleUploadImages(info, record)}
                        customRequest={({ file, onSuccess }) => onSuccess(file)}
                        maxCount={1}
                    >
                        {colorFileData.length >= 1 ? null : uploadButton}
                    </Upload>
                );
            },
            onCell: (record, rowIndex) => {
                const rowsWithSameColor = tableData.filter(
                    (item) => item.color === record.color
                );

                if (
                    rowIndex > 0 &&
                    record.color === tableData[rowIndex - 1].color
                ) {
                    return { rowSpan: 0 };
                }

                return {
                    rowSpan: rowsWithSameColor.length,
                };
            },
        },
    ];
    const handleQuantityChange = (value, key) => {
        if (value <= 0) {
            value = 1;
        }
        setTableData((prevTableData) =>
            prevTableData.map((item) =>
                item.key === key ? { ...item, quantity: value } : item
            )
        );
    };
    const handlePriceChange = (value, key) => {
        if (value <= 0) {
            value = 100000;
        }
        setTableData((prevTableData) =>
            prevTableData.map((item) =>
                item.key === key ? { ...item, price: value } : item
            )
        );
    };
    const formatCurrency = (value) => {
        const formatter = new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            currencyDisplay: "code",
        });
        return formatter.format(value);
    };
    const handleDelete = (recordToDelete) => {
        Modal.confirm({
            title: "Xác nhận xóa",
            content: "Bạn có chắc chắn muốn xóa  này?",
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            onOk() {
                const updatedTableData = tableData.filter(
                    (item) => item.key !== recordToDelete.key
                );
                const updatedTableDataWithSTT = updatedTableData.map((item, index) => ({
                    ...item,
                    stt: index + 1,
                }));
                setTableData(updatedTableDataWithSTT);
            },
        });
    };

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");

    const handleCancelImage = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(
            file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
        );
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );

    const [listColorAndFileData, setListColorAndFileData] = useState([]);
    const [isUploadValid, setUploadValid] = useState(true);

    const handleUploadImages = (info, record) => {
        const newFileData = [...listColorAndFileData];

        const existingColorData = newFileData.find(
            (item) => item.color === record.color
        );
        if (existingColorData) {
            existingColorData.fileData = info.fileList;
        } else {
            newFileData.push({
                color: record.color,
                fileData: info.fileList,
            });
        }

        setListColorAndFileData(newFileData);
    };

    const [selectedProduct, setSelectedProduct] = useState("");
    const [isProductNameValid, setProductNameValid] = useState(false);
    const handleProductNameChange = (value) => {
        setProductNameValid(value.trim() !== "");
    };

    const [tableData, setTableData] = useState([]);
    const dataDetail = () => {
        const formData = form.getFieldsValue();
        const newRecords = [];
        let stt = 1;
        listColorAdd.forEach((colorItem) => {
            listSizeAdd.forEach((sizeItem) => {
                const newRecord = {
                    key: `${colorItem.color}-${sizeItem.nameSize}`,
                    ...formData,
                    color: colorItem.color,
                    size: sizeItem.nameSize,
                    quantity: 1,
                    price: "100000",
                    stt: stt++,
                };
                newRecords.push(newRecord);
            });
        });
        setTableData(newRecords);
    };

    useEffect(() => {
        dataDetail();
    }, [listColorAdd, listSizeAdd]);

    const handleUploadTableData = () => {
        dataDetail();
    };
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const onSelectChange = (newSelectedRowKeys) => {
        console.log("selectedRowKeys changed: ", newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const [openQuantityAndPrice, setQuantityAndPrice] = useState(false);
    const handleUpdateQuantityAndPrice = (newValues) => {
        const updatedData = tableData.map((record) => {
            if (selectedRowKeys.includes(record.key)) {
                return {
                    ...record,
                    quantity: newValues.quantityCustom,
                    price: newValues.priceCustom,
                };
            }
            return record;
        });
        setTableData(updatedData);
        setQuantityAndPrice(false);
    };
    const showModalQuantityAndPrice = () => {
        setQuantityAndPrice(true);
    };
    const handleCancelQuantityAndPrice = () => {
        setQuantityAndPrice(false);
    };

    const [currentStep, setCurrentStep] = useState(0);


    return (
        <>
            <Card
                title="Tạo sản phẩm mới"
                bordered={false}
                style={{ maxWidth: 1200, margin: "0 auto" }}
            >
                <Steps current={currentStep} style={{ marginBottom: 40 }}>
                    <Steps.Step title="Thông tin" />
                    <Steps.Step title="Thuộc tính" />
                    <Steps.Step title="Biến thể" />
                </Steps>
                <Form form={form} layout="vertical">

                    {currentStep === 0 && (
                        <>
                            <Row gutter={24}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Tên sản phẩm"
                                        name="name"
                                        rules={[{ required: true, message: "Nhập tên sản phẩm" }]}
                                    >
                                        <Input size="large" placeholder="VD: Nike Air Force 1" />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item
                                        label="Trạng thái"
                                        name="status"
                                        initialValue="DANG_SU_DUNG"
                                    >
                                        <Select size="large">
                                            <Select.Option value="DANG_SU_DUNG">
                                                Đang kinh doanh
                                            </Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                label="Mô tả sản phẩm"
                                name="description"
                                rules={[{ required: true, message: "Nhập mô tả sản phẩm" }]}
                            >
                                <Input.TextArea rows={5} />
                            </Form.Item>
                        </>
                    )}
                    {currentStep === 1 && (
                        <Row gutter={[24, 24]}>
                            <Col span={8}>
                                <Form.Item name="brandId" label="Thương hiệu" rules={[{ required: true }]}>
                                    <Select placeholder="Chọn thương hiệu">
                                        {dataBrand?.map(x => (
                                            <Select.Option key={x.id} value={x.id}>
                                                {x.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item name="materialId" label="Chất liệu" rules={[{ required: true }]}>
                                    <Select placeholder="Chọn chất liệu">
                                        {dataMaterial?.map(x => (
                                            <Select.Option key={x.id} value={x.id}>
                                                {x.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item name="soleId" label="Đế giày" rules={[{ required: true }]}>
                                    <Select placeholder="Chọn đế giày">
                                        {dataSole?.map(x => (
                                            <Select.Option key={x.id} value={x.id}>
                                                {x.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item name="categoryId" label="Thể loại" rules={[{ required: true }]}>
                                    <Select placeholder="Chọn thể loại">
                                        {dataCategory?.map(x => (
                                            <Select.Option key={x.id} value={x.id}>
                                                {x.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item name="gender" label="Giới tính" rules={[{ required: true }]}>
                                    <Select placeholder="Chọn giới tính">
                                        {dataGender.map(x => (
                                            <Select.Option key={x.id} value={x.id}>
                                                {x.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    )}

                    {currentStep === 2 && (
                        <>
                            <Card title="Kích cỡ & màu sắc" style={{ marginBottom: 24 }}>
                                <Row gutter={24}>
                                    <Col span={12}>
                                        <h4>Kích cỡ</h4>
                                        {listSizeAdd.map((s, i) => (
                                            <Tag
                                                key={i}
                                                closable
                                                onClose={(e) => handleDeleteSize(e, i, s.nameSize)}
                                            >
                                                {s.nameSize}
                                            </Tag>
                                        ))}
                                        <Button type="dashed" block onClick={() => setModalAddSize(true)}>
                                            + Thêm kích cỡ
                                        </Button>
                                        <ModalAddListSizeProduct
                                            visible={modalAddSize}
                                            onCancel={handleCancel}
                                            onSaveData={handleSaveData}
                                        />
                                    </Col>

                                    <Col span={12}>
                                        <h4>Màu sắc</h4>
                                        {listColorAdd.map((c, i) => (
                                            <Tag
                                                key={i}
                                                color={c.color}
                                                closable
                                                onClose={(e) => handleDeleteColor(e, i, getColorName(c.color))}
                                            >
                                                {getColorName(c.color)}
                                            </Tag>
                                        ))}
                                        <Button type="dashed" block onClick={() => setModalAddColor(true)}>
                                            + Thêm màu sắc
                                        </Button>
                                        <AddColorModal
                                            visible={modalAddColor}
                                            onCancel={handleCancel}
                                            onSaveData={handleSaveDataColor}
                                        />
                                    </Col>
                                </Row>
                            </Card>

                            <Card title="Chi tiết sản phẩm">
                                <Button
                                    type="primary"
                                    onClick={showModalQuantityAndPrice}
                                    style={{ marginBottom: 16 }}
                                >
                                    Chỉnh giá & số lượng
                                </Button>

                                <Table
                                    rowKey="key"
                                    rowSelection={rowSelection}
                                    columns={columns}
                                    dataSource={tableData}
                                    pagination={{ pageSize: 5 }}
                                />
                            </Card>
                        </>
                    )}
                </Form>

                <Divider />

                <Row justify="space-between">
                    <Button
                        disabled={currentStep === 0}
                        onClick={() => setCurrentStep(s => s - 1)}
                    >
                        Quay lại
                    </Button>

                    {currentStep < 2 ? (
                        <Button type="primary" onClick={() => setCurrentStep(s => s + 1)}>
                            Tiếp tục
                        </Button>
                    ) : (
                        <Button type="primary" onClick={handleUpload}>
                            Hoàn tất
                        </Button>
                    )}
                </Row>
            </Card>
        </>
    );

};
export default CreateProductManagment;
