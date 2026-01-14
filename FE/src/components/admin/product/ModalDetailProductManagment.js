import React from "react";
import {
  Button,
  Col,
  Input,
  Modal,
  Row,
  Form,
  InputNumber,
  Select,
  Slider,
  Space,
  Spin,
  Table,
  Tooltip,
} from "antd";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faEye,
  faFilter,
  faKaaba,
  faRotateLeft,
  faListAlt,
} from "@fortawesome/free-solid-svg-icons";
import { ProductDetailApi } from "../../../api/admin/productDetail/productDetailApi";
import { useEffect } from "react";
import { MaterialApi } from "../../../api/admin/material/MaterialApi";
import { CategoryApi } from "../../../api/admin/category/CategoryApi";
import { SoleApi } from "../../../api/admin/sole/SoleApi";
import { BrandApi } from "../../../api/admin/brand/BrandApi";
import { ColorApi } from "../../../api/admin/color/ColorApi";
import { Option } from "antd/es/mentions";

const ModalDetailProductManagment = ({ id, visible, onCancel }) => {
  const [form] = Form.useForm();
  const [listMaterial, setListMaterial] = useState([]);
  const [listCategory, setListCategory] = useState([]);
  const [listBrand, setListBrand] = useState([]);
  const [listColor, setListColor] = useState([]);
  const [listSole, setListSole] = useState([]);

  const listSize = [];
  for (let size = 35; size <= 45; size++) {
    listSize.push(size);
  }
  const [modalVisible, setModalVisible] = useState(false);
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
  const handleCancel = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    if (productId) {
      getOne(productId);
    }
  }, [productId]);
  const getList = () => {
    MaterialApi.getAllMaterial().then((res) => setListMaterial(res.data.data));
    CategoryApi.getAllCategories().then((res) => setListCategory(res.data.data));
    SoleApi.getAllsole().then((res) => setListSole(res.data.data));
    BrandApi.getAllBrand().then((res) => setListBrand(res.data.data));
    MaterialApi.getAllMaterial().then((res) => setListMaterial(res.data.data));
    ColorApi.getAllCode().then((res) => setListColor(res.data.data));
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
    ProductDetailApi.getAll({
      product: search,
    }).then((res) => {
      setListProductDetails(res.data.data);
    });
  };

  const handleClear = () => {
    setSearch("");
    ProductDetailApi.getAll({
      idProduct: id,
      product: "",
    }).then((res) => {
      setListProductDetails(res.data.data);
    });
  };

  const loadData = () => {
    ProductDetailApi.getAll(selectedValues).then((res) => {
      setListProductDetails(res.data.data);
    });
  };

  useEffect(() => {
    setSelectedValues((prevValues) => ({
      ...prevValues,
      idProduct: id,
    }));
  }, [id, visible]);

  useEffect(() => {
    if (id != null && id !== "") {
      getList();
      loadData();
    }
    return () => {
      setListProductDetails(null);
      id = null;
    };
  }, [selectedValues, visible, id]);

  useEffect(() => {
    loadData();
  }, [selectedValues]);

  const getPromotionStyle = (promotion) => {
    return promotion >= 50 ? { color: "white" } : { color: "#000000" };
  };
  const getPromotionColor = (promotion) => {
    return promotion >= 50 ? { color: "#FF0000" } : { color: "#FFCC00" };
  };

  const getRowClassName = (record, index) => {
    return index % 2 === 0 ? "even-row" : "odd-row";
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: "5%",
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
            style={{ width: "80px", borderRadius: "10%", height: "50px" }}
          />
        </div>
      ),
    },
    {
      title: "Tên Sản Phẩm",
      dataIndex: "nameProduct",
      key: "nameProduct",
    },
    {
      title: "Giá Bán",
      dataIndex: "price",
      key: "price",
      render: (text) => formatCurrency(text),
    },
    {
      title: "Số Lượng ",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      title: "Kích Thước",
      dataIndex: "size",
      key: "size",
      width: "10%",
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
          text === "DANG_SU_DUNG" ? "trangthai-sd" : "trangthai-ksd";
        return (
          <button className={`gender ${genderClass}`}>
            {text === "DANG_SU_DUNG" ? "Đang kinh doanh " : "Không kinh doanh"}
          </button>
        );
      },
    }
  ];

  const [listProductDetails, setListProductDetails] = useState([]);

  // format tiền
  const formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      currencyDisplay: "code",
    });
    return formatter.format(value);
  };

  return (
    <>
      <Modal
        title="Sản phẩm trả về"
        visible={modalVisible}
        onCancel={handleCancel}
        cancelText="Thoát"
        style={{ fontWeight: "bold" }}
        footer={null}
      >
        <Form form={form}>
          <Form.Item label="Số lượng hàng trả" name="giveBack">
            <Input
              style={{ fontWeight: "bold", width: "100%", height: "auto" }}
              readOnly
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal open={visible} onCancel={onCancel} footer={null} width={1200}>
        <div className="title_sole">
          <span style={{ marginLeft: "35%" }}>Quản lý sản phẩm chi tiết </span>
        </div>

        <div className="filter">
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
                    <Option key={index} value={brand.name} >
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
                  <Option value="DANG_SU_DUNG">Đang sử dung</Option>
                  <Option value="KHONG_SU_DUNG">Không sử dụng</Option>
                </Select>
              </Col>
              <Col span={2} style={{ textAlign: "right", paddingRight: 10 }}>
                <label>Giới Tinh :</label>
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

              {/* <Col span={2} style={{ textAlign: "right", paddingRight: 10 }}>
              <label>Khoảng giá :</label>
            </Col>
            <Col span={3}>
              <Slider
                range={{
                  draggableTrack: true,
                }}
                defaultValue={[
                  selectedValues.minPrice,
                  selectedValues.maxPrice,
                ]}
                min={100000}
                max={30000000}
                tipFormatter={(value) => formatCurrency(value)}
                onChange={handleChangeValuePrice}
              />
            </Col> */}
            </Row>
          </div>
        </div>

        <div className="product-table">
          <div
            className="title_product"
            style={{ display: "flex", alignItems: "center" }}
          >
            {/* <FontAwesomeIcon
            icon={faListAlt}
            style={{ fontSize: "26px", marginRight: "10px" }}
          /> */}
            <span style={{ fontSize: "18px", fontWeight: "500" }}>
              Danh sách sản phẩm chi tiết
            </span>
            <hr />
          </div>
          <Table
            dataSource={listProductDetails}
            rowKey="id"
            columns={columns}
            pagination={{ pageSize: 10 }}
            scroll={{ y: 400 }}
            rowClassName={getRowClassName}
          />
        </div>
      </Modal>
    </>
  );
};

export default ModalDetailProductManagment;
