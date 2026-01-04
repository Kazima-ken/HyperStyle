package com.example.hyperstyle.dto.request.product;

import com.example.hyperstyle.infrastructure.constant.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProductRequest {

    private String id; // ID này sẽ được set từ URL vào Controller

    @NotBlank(message = "Không để trống Mã sản phẩm")
    private String code; // Sửa 'Code' -> 'code' (chuẩn Java)

    @NotBlank(message = "Không để trống Tên sản phẩm")
    private String name;

    @NotNull(message = "Không để trống Trạng thái")
    private Status status;

    @NotBlank(message = "Vui lòng chọn Thương hiệu")
    private String brandId;

    @NotBlank(message = "Vui lòng chọn Chất liệu")
    private String materialId;

    @NotBlank(message = "Vui lòng chọn Đế giày")
    private String soleId;

    @NotBlank(message = "Vui lòng chọn Danh mục")
    private String categoryId;
}
