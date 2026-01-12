import React, { useState } from "react";
import {
  Modal,
  InputNumber,
  Button,
  Form,
  Col,
  Select,
  Tooltip,
  Row,
  Input,
  message,
} from "antd";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/Hook";
import { GetSole, SetSole } from "../../../../app/reducer/SoleReducer";
import {
  GetCategory,
  SetCategory,
} from "../../../../app/reducer/CategoryReducer";
import {
  GetMaterial,
  SetMaterial,
} from "../../../../app/reducer/MaterialReducer";
import { GetBrand, SetBrand } from "../../../../app/reducer/BrandReducer";
import { GetSize, SetSize } from "../../../../app/reducer/SizeReducer";
import { MaterialApi } from "../../../../api/admin/material/MaterialApi";
import { CategoryApi } from "../../../../api/admin/category/CategoryApi";
import { SoleApi } from "../../../../api/admin/sole/SoleApi";
import { BrandApi } from "../../../../api/admin/brand/BrandApi";
import ModalCreateSole from "../../sole/modal/CreateModel";
import ModalCreateBrand from "../../brand/modal/CreateModel";
import ModalCreateCategory from "../../category/modal/CreateModel";
import ModalCreateMaterial from "../../material/modal/CreateModel";
import { ProductDetailApi } from '../../../../api/admin/productDetail/productDetailApi';
import { ProductApi } from '../../../../api/admin/product/ProductApi';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Option } from "antd/es/mentions";
import NumberFormat from "react-number-format";
import { PlusOutlined } from "@ant-design/icons";

import axios from "axios";
import { SizeApi } from "../../../../api/admin/size/SizeApi";
import { ColorApi } from "../../../../api/admin/color/ColorApi";
import ModalCreateColor from "./ModalCreateColor";
import { GetColor, SetColor } from "../../../../app/reducer/ColorReducer";

const ModalUpdateProductDetail = ({ id, visible, onCancel }) => {
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState({
    id: "",
    description: "",
    gender: "",
    price: "",
    quantity: "",
    status: "",
    categoryId: "",
    productId: "",
    materialId: "",
    colorId: "",
    soleId: "",
    brandId: "",
    sizeId: "",
  });
  const getOne = () => {
    if (!id) return;

    ProductDetailApi.getOne(id).then((res) => {
      const data = res.data.data;

      if (data) {
        let statusValue = "DANG_SU_DUNG";
        if (typeof data.status === 'boolean') {
          statusValue = data.status ? "DANG_SU_DUNG" : "KHONG_SU_DUNG";
        } else if (data.status) {
          statusValue = data.status;
        }

        const newValues = {
          id: data.id,
          description: data.description,
          gender: data.gender,
          price: data.price,
          quantity: data.quantity,
          status: statusValue,
          categoryId: data.idCategory,
          productId: data.nameProduct,
          materialId: data.idMaterial,
          soleId: data.idSole,
          brandId: data.idBrand,
          sizeId: data.idSize,
          colorId: data.idColor,
        };

        setInitialValues(newValues);
        form.setFieldsValue(newValues);
      }
    }).catch((err) => {
      console.error("Lỗi khi lấy chi tiết sản phẩm:", err);
      message.error("Không thể tải thông tin sản phẩm");
    });
  };

  useEffect(() => {
    if (id != null && id !== "") {
      getOne();
    }
  }, [id]);

  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setFileList([]);
    }
  }, [visible]);

  const dispatch = useAppDispatch();
  const status = "DANG_SU_DUNG";
  const [modalAddSole, setModalAddSole] = useState(false);
  const [modalAddCategopry, setModalAddCategory] = useState(false);
  const [modalAddMaterial, setModalAddMaterial] = useState(false);
  const [modalAddBrand, setModalAddBrand] = useState(false);
  const [modalAddColor, setModalAddColor] = useState(false);

  const dataSole = useAppSelector(GetSole);
  const dataCategory = useAppSelector(GetCategory);
  const dataMaterial = useAppSelector(GetMaterial);
  const dataBrand = useAppSelector(GetBrand);
  const dataSize = useAppSelector(GetSize);
  const dataColor = useAppSelector(GetColor);

  const handleCancel = () => {
    setModalAddSole(false);
    setModalAddBrand(false);
    setModalAddMaterial(false);
    setModalAddCategory(false);
    setModalAddColor(false);
  };

  const getList = () => {
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
    SizeApi.getAllSize({
      status: status,
    }).then((res) => {
      dispatch(SetSize(res.data.data));
    });
    ColorApi.getAllcolor({
      status: status,
    }).then((res) => {
      dispatch(SetColor(res.data.data));
    });
  };

  useEffect(() => {
    getList();
  }, []);


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
  const [fileList, setFileList] = useState([]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    const fileExists = fileList.find((f) => f.uid === file.uid);

    // If the file doesn't exist, add it to the fileList with isStarred property initialized to false
    if (!fileExists) {
      const newFile = { ...file, isStarred: false };
      setFileList([...fileList, newFile]);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const handleUpdate = () => {
    form.validateFields()
      .then((values) => {
        return new Promise((resolve, reject) => {
          Modal.confirm({
            title: "Xác nhận",
            content: "Bạn có đồng ý cập nhật không?",
            okText: "Đồng ý",
            cancelText: "Hủy",
            onOk: () => resolve(values),
            onCancel: () => reject(),
          });
        });
      })
      .then((values) => {
        // xử lý giá tiền
        if (/VND$/.test(values.price)) {
          values.price = values.price.replace(/\D/g, "");
        }

        console.log("DATA UPDATE:", values);

        ProductDetailApi.update(id, values)
          .then(() => {
            message.success("Cập nhật thành công");
            window.location.reload();
            form.resetFields();
          })
          .catch((error) => {
            console.error(error);
            message.error("Có lỗi xảy ra khi cập nhật");
          });
      })
      .catch(() => {
        message.error("Cập nhật thất bại");
      });
  };


  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      width="70%"
      style={{ height: "65vh", overflowY: "auto" }}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="update" type="primary" onClick={handleUpdate}>
          Chỉnh sửa
        </Button>,
      ]}
      mask={false}
      maskClosable={false}
    >
      <div className="filter">
        <div
          className="title_product"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              marginTop: "1%",
              marginBottom: "2%",
            }}
          >
            Thông Tin Sản Phẩm
          </span>
        </div>
        <Form form={form} initialValues={initialValues}>
          <Form.Item
            label="Tên sản phẩm"
            name="productId"
            style={{ fontWeight: "bold" }}
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
          >
            <Input style={{ fontWeight: "bold", height: "40px" }} readOnly />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            style={{ fontWeight: "bold" }}
            rules={[
              { required: true, message: "Vui lòng nhập mô tả sản phẩm" },
            ]}
          >
            <Input.TextArea rows={4} placeholder="Nhập mô tả sản phẩm" />
          </Form.Item>
          <br />

          <Row gutter={7} justify="space-around">
            <Col span={8}>
              <Form.Item
                label="Thương hiệu"
                name="brandId"
                style={{ fontWeight: "bold" }}
                rules={[
                  { required: true, message: "Vui lòng chọn thương hiệu" },
                ]}
              >
                <Select placeholder="Chọn thương hiệu">
                  {dataBrand.map((brand, index) => (
                    <Option key={index} value={brand.id}>
                      <span style={{ fontWeight: "bold" }}>{brand.name}</span>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item>
                <Tooltip title="Thêm thương hiệu">
                  <Button
                    type="primary"
                    icon={<FontAwesomeIcon icon={faPlus} />}
                    style={{ height: 30 }}
                    onClick={() => setModalAddBrand(true)}
                  />
                </Tooltip>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Trạng thái"
                name="status"
                style={{ fontWeight: "bold" }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn trạng thái sản phẩm",
                  },
                ]}
              >
                <Select>
                  <Option value="DANG_SU_DUNG">
                    <span style={{ fontWeight: "bold" }}>Kinh Doanh</span>
                  </Option>
                  <Option value="KHONG_SU_DUNG">
                    <span style={{ fontWeight: "bold" }}>Không Kinh Doanh</span>
                  </Option>
                  <Option value="HET_SAN_PHAM">
                    <span style={{ fontWeight: "bold" }}>Hết sản phẩm</span>
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item>
                <Button
                  type="primary"
                  icon={<FontAwesomeIcon icon={faPlus} />}
                  style={{ height: 30 }}
                ></Button>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={7} justify="space-around">
            <Col span={8}>
              <Form.Item
                label="Chất Liệu"
                name="materialId"
                style={{ fontWeight: "bold" }}
                rules={[
                  { required: true, message: "Vui lòng chọn thương hiệu" },
                ]}
              >
                <Select placeholder="Chọn chất liệu">
                  {dataMaterial.map((material, index) => (
                    <Option key={index} value={material.id}>
                      <span style={{ fontWeight: "bold" }}>
                        {material.name}
                      </span>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item>
                <Tooltip title="Thêm vật liệu">
                  <Button
                    type="primary"
                    icon={<FontAwesomeIcon icon={faPlus} />}
                    style={{ height: 30 }}
                    onClick={() => setModalAddMaterial(true)}
                  />
                </Tooltip>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Đế Giày"
                name="soleId"
                style={{ fontWeight: "bold" }}
                rules={[{ required: true, message: "Vui lòng chọn thể loại" }]}
              >
                <Select placeholder="Chọn đế giày">
                  {dataSole.map((sole, index) => (
                    <Option key={index} value={sole.id}>
                      <span style={{ fontWeight: "bold" }}>{sole.name}</span>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item>
                <Tooltip title="Thêm đế giày">
                  <Button
                    type="primary"
                    icon={<FontAwesomeIcon icon={faPlus} />}
                    style={{ height: 30 }}
                    onClick={() => setModalAddSole(true)}
                  />
                </Tooltip>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={7} justify="space-around">
            <Col span={8}>
              <Form.Item
                label="Giới Tính"
                name="gender"
                style={{ fontWeight: "bold" }}
                rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
              >
                <Select placeholder="Chọn giới tính">
                  <Option value="NAM">
                    <span style={{ fontWeight: "bold" }}>Nam</span>
                  </Option>
                  <Option value="NU">
                    {" "}
                    <span style={{ fontWeight: "bold" }}>Nữ</span>
                  </Option>
                  <Option value="NAM_VA_NU">
                    {" "}
                    <span style={{ fontWeight: "bold" }}>Nam và Nữ</span>
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item>
                <Tooltip title="Thêm giới tính">
                  <Button
                    type="primary"
                    icon={<FontAwesomeIcon icon={faPlus} />}
                    style={{ height: 30 }}
                  />
                </Tooltip>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Thể loại"
                name="categoryId"
                style={{ fontWeight: "bold" }}
                rules={[{ required: true, message: "Vui lòng chọn thể loại" }]}
              >
                <Select placeholder="Chọn thể loại">
                  {dataCategory.map((category, index) => (
                    <Option key={index} value={category.id}>
                      <span style={{ fontWeight: "bold" }}>
                        {category.name}
                      </span>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item>
                <Tooltip title="Thêm thể loại">
                  <Button
                    type="primary"
                    icon={<FontAwesomeIcon icon={faPlus} />}
                    style={{ height: 30 }}
                    onClick={() => setModalAddCategory(true)}
                  ></Button>
                </Tooltip>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={7} justify="space-around">
            <Col span={8}>
              <Form.Item
                label="Màu Sắc"
                name="colorId"
                style={{ fontWeight: "bold" }}
                rules={[{ required: true, message: "Vui lòng chọn màu sắc" }]}
              >
                <Select placeholder="Chọn màu sắc">
                  {dataColor.map((color, index) => (
                    <Option key={index} value={color.id}>
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
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item>
                <Tooltip title="Thêm màu sắc">
                  <Button
                    type="primary"
                    icon={<FontAwesomeIcon icon={faPlus} />}
                    style={{ height: 30 }}
                    onClick={() => setModalAddColor(true)}
                  />
                </Tooltip>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Kích Cỡ"
                name="sizeId"
                style={{ fontWeight: "bold" }}
                rules={[
                  { required: true, message: "Vui lòng nhập kích cỡ sản phẩm" },
                ]}
              >
                <Select placeholder="Chọn kích cỡ">
                  {dataSize.map((size, index) => (
                    <Option key={index} value={size.id}>
                      <span style={{ fontWeight: "bold" }}>{size.name}</span>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item>
                <Tooltip title="Thêm kích thước">
                  <Button
                    type="primary"
                    icon={<FontAwesomeIcon icon={faPlus} />}
                    style={{ height: 30 }}
                  />
                </Tooltip>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={7} justify="space-around">
            <Col span={8}>
              <Form.Item
                label="Số Lượng tồn kho"
                name="quantity"
                style={{ fontWeight: "bold" }}
                rules={[
                  { required: true, message: "Vui lòng nhập số lượng" },
                  {
                    type: "number",
                    min: 1,
                    message: "Số lượng tối thiểu là 1",
                  }, // Minimum value validation
                ]}
              >
                <InputNumber
                  style={{ fontWeight: "bold", width: "100%", height: "40px" }}
                  placeholder="Nhập số lượng"
                />
              </Form.Item>
            </Col>
            <Col span={5}></Col>
            <Col span={8}>
              <Form.Item
                label="Giá Bán"
                name="price"
                style={{ fontWeight: "bold" }}
                rules={[
                  { required: true, message: "Vui lòng nhập giá sản phẩm" },
                ]}
              >
                <NumberFormat
                  thousandSeparator={true}
                  suffix=" VND"
                  placeholder="Nhập giá sản phẩm"
                  style={{
                    fontWeight: "bold",
                    height: "40px",
                    width: "100%",
                  }}
                  customInput={Input}
                />
              </Form.Item>
            </Col>
            <Col span={2}></Col>
          </Row>
        </Form>
        <ModalCreateSole visible={modalAddSole} onCancel={handleCancel} />
        <ModalCreateBrand visible={modalAddBrand} onCancel={handleCancel} />
        <ModalCreateCategory
          visible={modalAddCategopry}
          onCancel={handleCancel}
        />
        <ModalCreateMaterial
          visible={modalAddMaterial}
          onCancel={handleCancel}
        />
        <ModalCreateColor visible={modalAddColor} onCancel={handleCancel} />
      </div>
    </Modal>
  );
};

export default ModalUpdateProductDetail;
