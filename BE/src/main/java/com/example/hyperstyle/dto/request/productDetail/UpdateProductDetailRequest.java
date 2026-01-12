package com.example.hyperstyle.dto.request.productDetail;

import com.example.hyperstyle.infrastructure.constant.Gender;
import com.example.hyperstyle.infrastructure.constant.Status;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

@Getter
@Setter
public class UpdateProductDetailRequest {

    private String id; // ID của ProductDetail (Lấy từ PathVariable cũng được, để đây cho chắc)

    @NotBlank(message = "Màu sắc không được để trống")
    private String colorId;

    @NotBlank(message = "Kích cỡ không được để trống")
    private String sizeId;

    // --- THÔNG TIN CẬP NHẬT ---

    @NotNull(message = "Giới tính không được để trống")
    private Gender gender;

    @NotNull(message = "Trạng thái không được để trống")
    private Status status;

    private String description;

    @NotNull(message = "Giá không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá phải lớn hơn 0")
    private BigDecimal price;

    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 1, message = "Số lượng phải lớn hơn 0")
    private Integer quantity;
}
