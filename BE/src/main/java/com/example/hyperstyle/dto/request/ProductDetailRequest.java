package com.example.hyperstyle.dto.request;

import com.example.hyperstyle.infrastructure.constant.Gender;
import com.example.hyperstyle.infrastructure.constant.Status;
import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

/**
 * DTO dùng để nhận dữ liệu từ request POST/PUT
 * Chứa các thông tin cơ bản và ID của các Entity liên quan (Product, Color, Size).
 */
@Getter
@Setter
public class ProductDetailRequest {

    // Thông tin cơ bản
    @NotNull(message = "Giá không được để trống")
    private BigDecimal price;

    @NotNull(message = "Số lượng không được để trống")
    private Integer quantity;

    private String description; // Mô tả có thể null

    @NotNull(message = "Giới tính không được để trống")
    private Gender gender;

    @NotNull(message = "Trạng thái không được để trống")
    private Status status;

    // Khóa ngoại (Sử dụng ID để mapping)
    @NotBlank(message = "ID Sản phẩm (Product) không được để trống")
    private String idProduct;

    @NotBlank(message = "ID Màu sắc (Color) không được để trống")
    private String idColor;

    @NotBlank(message = "ID Kích cỡ (Size) không được để trống")
    private String idSize;
}