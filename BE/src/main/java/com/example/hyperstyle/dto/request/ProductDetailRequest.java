package com.example.hyperstyle.dto.request;

import com.example.hyperstyle.infrastructure.constant.Gender;
import com.example.hyperstyle.infrastructure.constant.Status;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import java.math.BigDecimal;

@Data
public class ProductDetailRequest {


    @NotBlank(message = "ID Sản phẩm gốc không được trống")
    private String idProduct;

    @NotBlank(message = "ID Màu sắc không được trống")
    private String idColor;

    @NotBlank(message = "ID Kích cỡ không được trống")
    private String idSize;

    // --- Thông tin chi tiết ---

    @NotNull(message = "Giá bán không được để trống")
    @Min(value = 0, message = "Giá bán phải lớn hơn 0")
    private BigDecimal price;

    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 0, message = "Số lượng phải lớn hơn hoặc bằng 0")
    private Integer quantity;

    private String description;

    // 🎯 ĐÃ SỬA: Thêm trường Gender, ánh xạ chuỗi như "NAM"
    @NotNull(message = "Giới tính không được để trống")
    private Gender gender;

    // 🎯 ĐÃ SỬA: Thay Integer bằng Enum Status, ánh xạ chuỗi như "DANG_SU_DUNG"
    @NotNull(message = "Trạng thái không được để trống")
    private Status status;
}