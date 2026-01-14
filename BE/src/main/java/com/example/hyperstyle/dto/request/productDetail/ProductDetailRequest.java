package com.example.hyperstyle.dto.request.productDetail;

import com.example.hyperstyle.infrastructure.constant.Gender;
import com.example.hyperstyle.infrastructure.constant.Status;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ProductDetailRequest {

    @NotBlank(message = "Vui Lòng Chọn Sản Phẩm")
    private String productId;

    @NotBlank(message = "Vui Lòng Chọn Kích Cỡ")
    private String sizeId;

    @NotBlank(message = "Vui Lòng Chọn Màu Sắc")
    private String colorId;

    private String description;

    @NotNull(message = "Vui Lòng Chọn Giới Tính")
    private Gender gender;

    @NotNull(message = "Vui Lòng Nhập Số Lượng")
    @Min(value = 1, message = "Số lượng phải Lớn Hơn 0")
    private Integer quantity;

    @NotNull(message = "Vui Lòng Nhập Giá")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá phải Lớn Hơn 0")
    private BigDecimal price;

    @NotNull(message = "Vui Lòng Chọn Trạng Thái")
    private Status status;
}