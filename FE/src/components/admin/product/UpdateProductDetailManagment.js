import {
  faEdit,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Col,
  Input,
  Form,
  InputNumber,
  Modal,
  Row,
  Select,
  Slider,
  Table,
  Tooltip,
  message,
} from "antd";
import { useState } from "react";
import { useParams } from "react-router";
import { ProductDetailApi } from "../../../api/admin/productDetail/productDetailApi";
import { useEffect } from "react";
import { MaterialApi } from "../../../api/admin/material/MaterialApi";
import { CategoryApi } from "../../../api/admin/category/CategoryApi";
import { SoleApi } from "../../../api/admin/sole/SoleApi";
import { ColorApi } from "../../../api/admin/color/ColorApi";
import { BrandApi } from "../../../api/admin/brand/BrandApi";
import { Option } from "antd/es/mentions";
import "./style-product.css";

import { useNavigate } from "react-router-dom";
import ModalUpdateProductDetail from "./modal/ModalUpdateProductDetail";
import ModalPriceAndQuantity from "./modal/ModalPriceAndQuantity";

const UpdateProductDetailManagment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [listMaterial, setListMaterial] = useState([]);
  const [listCategory, setListCategory] = useState([]);
  const [listBrand, setListBrand] = useState([]);
  const [listColor, setListColor] = useState([]);
  const [listSole, setListSole] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);

  const handleCancel = () => {
    setModalVisible(false);
  };

  const listSize = [];
  for (let size = 35; size <= 45; size++) {
    listSize.push(size);
  }

  const getList = () => {
    MaterialApi.getAllMaterial().then((res) => setListMaterial(res.data.data));
    CategoryApi.getAllCategories().then((res) => setListCategory(res.data.data));
    SoleApi.getAllsole().then((res) => setListSole(res.data.data));
    BrandApi.getAllBrand().then((res) => setListBrand(res.data.data));
    MaterialApi.getAllMaterial().then((res) => setListMaterial(res.data.data));
    ColorApi.getAllCode().then((res) => setListColor(res.data.data));
  };

  const [selectedValues, setSelectedValues] = useState({
    idProduct: id,
    color: "",
    brand: "",
    material: "",
    product: "",
    size: null,
    sole: "",
    category: "",
    gender: "",
    status: "",
    minPrice: 0,
    maxPrice: 50000000000,
  });

  const handleSelectChange = (value, fieldName) => {
    setSelectedValues((prevValues) => ({
      ...prevValues,
      [fieldName]: value,
    }));
  };

  const [initialValues, setInitialValues] = useState({
    giveBack: 0,
  });
  const [productId, setProductId] = useState(null);

  const getOne = (id) => {
    if (!id) return;
    ProductDetailApi.getOne(id).then((productData) => {
      setInitialValues({
        giveBack: productData.data.data.productGiveBack,
      });
    });
  };

  useEffect(() => {
    if (productId) {
      getOne(productId);
    }
  }, [productId]);

  const handleChangeValuePrice = (value) => {
    const [minPrice, maxPrice] = value;

    setSelectedValues((prevValues) => ({
      ...prevValues,
      minPrice: minPrice,
      maxPrice: maxPrice,
    }));
  };

  const [search, setSearch] = useState("");

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmitSearch = (event) => {
    event.preventDefault();
    ProductDetailApi.getAll(selectedValues).then((res) => {
      setListProductDetails(res.data.data);
      setSelectedRowKeys(temporarySelectedRowKeys);
    });
  };

  const handleClear = () => {
    setSearch("");
    ProductDetailApi.getAll({
      idProduct: id,
      product: "",
    }).then((res) => {
      setListProductDetails(res.data.data);
      setSelectedRowKeys(temporarySelectedRowKeys);
    });
  };

  useEffect(() => {
    getList();
    loadData();
  }, [selectedValues]);


  const getRowClassName = (record, index) => {
    return index % 2 === 0 ? "even-row" : "odd-row";
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      // sorter: (a, b) => a.stt - b.stt,
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (text, record) => (
        <div style={{ position: "relative", display: "inline-block" }}>
          <img
            src={text}
            alt="Ảnh sản phẩm"
            style={{ width: "100px", borderRadius: "10%", height: "100px" }}
          />
        </div>
      ),
    },
    {
      title: "Tên Sản Phẩm",
      dataIndex: "nameProduct",
      key: "nameProduct",
      // sorter: (a, b) => a.nameProduct.localeCompare(b.nameProduct),
    },
    {
      title: "Số Lượng",
      dataIndex: "quantity",
      key: "quantity",
      // sorter: (a, b) => a.quantity - b.quantity,
      align: "center",
    },
    {
      title: "Giá Bán",
      dataIndex: "price",
      key: "price",
      render: (text, record, index) => (
        <div>
          <span>{formatCurrency(record.price)}</span>
        </div>
      ),
    },
    {
      title: "Kích Thước",
      dataIndex: "size",
      key: "size",
      // sorter: (a, b) => a.quantity - b.quantity,
      align: "center",
    },
    {
      title: "Màu Sắc",
      dataIndex: "color",
      key: "color",
      align: "center",
      render: (color) => (
        <div
          style={{
            backgroundColor: color,
            borderRadius: "6px",
            width: "40px",
            marginLeft: "30px",
            height: "25px",
            pointerEvents: "none",
          }}
        />
      ),
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (text) => {
        const genderClass =
          text === "DANG_SU_DUNG"
            ? "trangthai-sd"
            : text === "KHONG_SU_DUNG"
              ? "trangthai-ksd"
              : "trangthai-hethang";
        return (
          <button className={`gender ${genderClass}`}>
            {text === "DANG_SU_DUNG"
              ? "Đang kinh doanh "
              : text === "KHONG_SU_DUNG"
                ? "Không kinh doanh"
                : "Hết sản phẩm "}
          </button>
        );
      },
    },
    {
      title: "Hành động",
      dataIndex: "hanhDong",
      key: "hanhDong",
      render: (text, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Tooltip title="Chi tiết sản phẩm">
            <Button
              type="primary"
              style={{ backgroundColor: "#1677ff", marginLeft: "35px" }}
              onClick={() => {
                console.log("ID của sản phẩm là:", record.id); // Log trực tiếp giá trị id

                handleUpdateClick(record.id); // Gọi hàm xử lý
              }}
            >
              <FontAwesomeIcon icon={faEye} />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const [listProductDetails, setListProductDetails] = useState([]);
  const [updatedDetails, setUpdatedDetails] = useState([]);
  const handleQuantityChange = (id, value) => {
    if (!temporarySelectedRowKeys.includes(id)) {
      message.warning("Vui lòng chọn hàng để chỉnh sửa trước.");
      return;
    }

    if (value === null || value === undefined || isNaN(value) || value <= 0) {
      return;
    }

    const updatedRow = {
      ...listProductDetails.find((detail) => detail.id === id),
      quantity: value,
    };

    setUpdatedDetails((prevDetails) => [
      ...prevDetails.filter((detail) => detail.id !== id),
      updatedRow,
    ]);

    if (selectedRowKeys.includes(id)) {
      setListProductDetails((prevDetails) =>
        prevDetails.map((detail) => (detail.id === id ? updatedRow : detail))
      );
    }
  };

  const handlePriceChange = (id, value) => {
    if (!temporarySelectedRowKeys.includes(id)) {
      message.warning("Vui lòng chọn hàng để chỉnh sửa trước.");
      return;
    }

    if (value === null || value === undefined || isNaN(value) || value <= 0) {
      return;
    }

    const updatedRow = {
      ...listProductDetails.find((detail) => detail.id === id),
      price: value,
    };

    setUpdatedDetails((prevDetails) => [
      ...prevDetails.filter((detail) => detail.id !== id),
      updatedRow,
    ]);

    if (selectedRowKeys.includes(id)) {
      setListProductDetails((prevDetails) =>
        prevDetails.map((detail) => (detail.id === id ? updatedRow : detail))
      );
    }
  };

  const handleUpload = () => {
    Modal.confirm({
      title: "Xác nhận",
      content: "Bạn có đồng ý update sản phẩm không?",
      okText: "Đồng ý",
      cancelText: "Hủy",
      onOk: () => {
        console.log(updatedDetails);
        if (updatedDetails.length === 0) {
          message.warning("Bạn chưa có sản phẩm để chỉnh sửa");
          return;
        }
        const extractedDetails = updatedDetails.map(
          ({ id, quantity, price }) => ({
            id,
            quantity,
            price,
          })
        );
        console.log(extractedDetails);
        const formData = new FormData();
        formData.append("data", extractedDetails);
        ProductDetailApi.updateListProduct(extractedDetails).then(
          (response) => {
            console.log(response.data);
            setSelectedRowKeys([]);
            setTemporarySelectedRowKeys([]);
            loadData();
          }
        );
      },
    });
  };

  const loadData = () => {
    ProductDetailApi.getAll(selectedValues).then((res) => {
      const detailsWithInitialValues = res.data.data.map((detail) => ({
        ...detail,
        initialQuantity: detail.quantity,
        initialPrice: detail.price,
      }));
      setListProductDetails(detailsWithInitialValues);
    });
  };

  // format tiền
  const formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      currencyDisplay: "code",
    });
    return formatter.format(value);
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowForEdit, setSelectedRowForEdit] = useState([]);
  const [temporarySelectedRowKeys, setTemporarySelectedRowKeys] = useState([]);

  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(selectedRows);
    setSelectedRowForEdit(null);

    const resetDetails = listProductDetails.map((detail) => {
      if (newSelectedRowKeys.includes(detail.id)) {
        return detail;
      } else {
        return {
          ...detail,
          quantity: detail.initialQuantity,
          price: detail.initialPrice,
        };
      }
    });

    setListProductDetails(resetDetails);
    setTemporarySelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: "odd",
        text: "Select Odd Row",
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: "even",
        text: "Select Even Row",
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };

  const [openQuantityAndPrice, setQuantityAndPrice] = useState(false);
  const handleUpdateQuantityAndPrice = (newValues) => {
    const updatedData = listProductDetails.map((record) => {
      if (selectedRowKeys.includes(record.id)) {
        return {
          ...record,
          quantity: newValues.quantityCustom,
          price: newValues.priceCustom,
        };
      }
      return record;
    });

    setListProductDetails(updatedData);
    setUpdatedDetails(updatedData);
    setQuantityAndPrice(false);
  };

  const showModalQuantityAndPrice = () => {
    setQuantityAndPrice(true);
  };
  const handleCancelQuantityAndPrice = () => {
    setQuantityAndPrice(false);
  };

  // detail update product detail
  const [modalUpdateVisible, setModalUpdateVisible] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const handleUpdateClick = (detail) => {
    console.log("ID được chọn:", id);
    setModalUpdateVisible(true);
    setSelectedDetail(detail);
  };
  const handleGiveBackClick = (id) => {
    ProductDetailApi.getOne(id)
      .then((productData) => {
        console.log(
          "Giá trị giveBack từ API: ",
          productData.data.data.productGiveBack
        );

        form.setFieldsValue({
          giveBack: productData.data.data.productGiveBack,
        });

        setModalVisible(true);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy sản phẩm:", error);
      });
  };
  const handleModalCancel = () => {
    setModalUpdateVisible(false);
  };

  return (
    <>
      <div className="title_sole">
        <span style={{ marginLeft: "35%" }}>Quản lý sản phẩm chi tiết</span>
      </div>
      <Modal
        title="Sản phẩm trả về"
        open={modalVisible}
        onCancel={handleCancel}
        cancelText="Thoát"
        style={{ fontWeight: "bold" }}
        footer={null}
      >
      </Modal>
      <div className="filter">
        {/* <FontAwesomeIcon icon={faFilter} size="2x" />{" "} */}
        <span style={{ fontSize: "18px", fontWeight: "500" }}>Bộ lọc</span>
        <hr />
        <div className="box_btn_filter">
          <Row align="middle">
            <Col span={3} style={{ textAlign: "right", paddingRight: 10 }}>
              <label>Thương Hiệu :</label>
            </Col>
            <Col span={2}>
              <Select
                style={{ width: "100%" }}
                value={selectedValues.brand}
                onChange={(value) => handleSelectChange(value, "brand")}
              >
                <Option value="">Tất cả</Option>
                {listBrand.map((brand, index) => (
                  <Option key={index} value={brand.name}>
                    {brand.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={2} style={{ textAlign: "right", paddingRight: 10 }}>
              <label>Màu Sắc :</label>
            </Col>
            <Col span={2}>
              <Select
                style={{ width: "100%" }}
                value={selectedValues.color}
                onChange={(value) => handleSelectChange(value, "color")}
                defaultValue=""
              >
                <Option value="">Tất cả</Option>
                {listColor.map((color, index) => (
                  <Option key={index} value={color.code}>
                    <div
                      style={{
                        backgroundColor: color.code,
                        width: "100%",
                        height: "100%",
                        borderRadius: "5px",
                      }}
                    ></div>
                  </Option>
                ))}
              </Select>
            </Col>

            <Col span={2} style={{ textAlign: "right", paddingRight: 10 }}>
              <label>Đế giày :</label>
            </Col>
            <Col span={2}>
              <Select
                style={{ width: "100%" }}
                value={selectedValues.sole}
                onChange={(value) => handleSelectChange(value, "sole")}
                defaultValue=""
              >
                <Option value="">Tất cả</Option>
                {listSole.map((sole, index) => (
                  <Option key={index} value={sole.name}>
                    {sole.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={2} style={{ textAlign: "right", paddingRight: 10 }}>
              <label>Chất Liệu :</label>
            </Col>
            <Col span={2}>
              <Select
                style={{ width: "100%" }}
                value={selectedValues.material}
                onChange={(value) => handleSelectChange(value, "material")}
                defaultValue=""
              >
                <Option value="">Tất cả</Option>
                {listMaterial.map((material, index) => (
                  <Option key={index} value={material.name}>
                    {material.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={2} style={{ textAlign: "right", paddingRight: 10 }}>
              <label>Kích cỡ :</label>
            </Col>
            <Col span={2}>
              <Select
                style={{ width: "100%" }}
                value={selectedValues.size}
                onChange={(value) => handleSelectChange(value, "size")}
                defaultValue={null}
              >
                <Option value={null}>Tất cả</Option>
                {listSize.map((size, index) => (
                  <Option key={index} value={size}>
                    {size}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
        </div>
        <div className="box_btn_filter">
          <Row align="middle">
            <Col span={4} style={{ textAlign: "right", paddingRight: 10 }}>
              <label>Thể Loại :</label>
            </Col>
            <Col span={3}>
              <Select
                style={{ width: "100%" }}
                value={selectedValues.category}
                onChange={(value) => handleSelectChange(value, "category")}
                defaultValue=""
              >
                <Option value="">Tất cả</Option>
                {listCategory.map((category, index) => (
                  <Option key={index} value={category.name}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={2} style={{ textAlign: "right", paddingRight: 10 }}>
              <label>Trạng Thái :</label>
            </Col>
            <Col span={3}>
              <Select
                style={{ width: "100%" }}
                value={selectedValues.status}
                onChange={(value) => handleSelectChange(value, "status")}
                defaultValue=""
              >
                <Option value="">Tất cả</Option>
                <Option value="DANG_SU_DUNG">Đang kinh doanh</Option>
                <Option value="KHONG_SU_DUNG">Không kinh doanh</Option>
              </Select>
            </Col>
            <Col span={2} style={{ textAlign: "right", paddingRight: 10 }}>
              <label>Giới Tính :</label>
            </Col>
            <Col span={3}>
              <Select
                style={{ width: "100%" }}
                value={selectedValues.gender}
                onChange={(value) => handleSelectChange(value, "gender")}
                defaultValue=""
              >
                <Option value="">Tất cả</Option>
                <Option value="NAM">Nam</Option>
                <Option value="NU">Nữ</Option>
              </Select>
            </Col>
          </Row>
        </div>
      </div>

      <div className="product-table">
        <div
          className="title_product"
          style={{ display: "flex", alignItems: "center" }}
        >

          <span style={{ fontSize: "18px", fontWeight: "500" }}>
            Danh sách sản phẩm chi tiết
          </span>
          <div style={{ marginLeft: "auto" }}>
            <Tooltip title=" Chỉnh số lượng và giá chung">
              <Button
                className="btn_filter"
                onClick={showModalQuantityAndPrice}
                style={{
                  height: "40px",
                  margin: "0px 20px",
                }}
              >
                Chỉnh số lượng và giá chung
              </Button>
            </Tooltip>
            <Tooltip title=" Cập nhập ">
              <Button
                className="btn_filter"
                icon={<FontAwesomeIcon icon={faEdit} />}
                style={{ height: 40 }}
                onClick={handleUpload}
              >
                Update sản phẩm
              </Button>
            </Tooltip>
          </div>
        </div>
        <div style={{ marginTop: "25px" }}>
          <Table
            rowSelection={rowSelection}
            dataSource={listProductDetails}
            rowKey="id"
            columns={columns}
            pagination={{ pageSize: 10 }}
            className="product-table"
            rowClassName={getRowClassName}
          />
        </div>
        <ModalUpdateProductDetail
          id={selectedDetail}               // Truyền ID đã lưu trong state
          visible={modalUpdateVisible}      // Truyền trạng thái bật/tắt
          onCancel={() => {
            setModalUpdateVisible(false); // Hàm đóng modal
            setSelectedDetail(null);      // Reset ID khi đóng
          }}
        />
        <ModalPriceAndQuantity
          open={openQuantityAndPrice}
          onCancel={handleCancelQuantityAndPrice}
          onUpdate={handleUpdateQuantityAndPrice}
        />
      </div>
    </>
  );
};

export default UpdateProductDetailManagment;
