package com.example.hyperstyle.dto.request.productDetail;

import com.example.hyperstyle.infrastructure.constant.Gender;
import com.example.hyperstyle.infrastructure.constant.Status;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CreateProductDetailRequest {

    @NotBlank(message = "Sản phẩm không được để trống")
    private String productId; // Sửa tên idProduct -> productId cho chuẩn CamelCase

    @NotBlank(message = "Màu sắc không được để trống")
    private String colorId;   // Nhận ID (Guid/String), không nhận tên màu

    @NotBlank(message = "Kích cỡ không được để trống")
    private String sizeId;    // Nhận ID size

    @NotNull(message = "Giới tính không được để trống")
    private Gender gender;    // Dùng Enum, không dùng String. Bỏ @NotBlank

    @NotNull(message = "Trạng thái không được để trống")
    private Status status;    // Dùng Enum. Bỏ @NotBlank

    private String description; // Có thể để trống, không cần @NotBlank

    @NotNull(message = "Giá không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá phải lớn hơn 0")
    private BigDecimal price; // Dùng BigDecimal. Bỏ @NotBlank

    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 1, message = "Số lượng phải lớn hơn 0")
    private Integer quantity; // Dùng Integer + @Min. Bỏ @NotBlank
}