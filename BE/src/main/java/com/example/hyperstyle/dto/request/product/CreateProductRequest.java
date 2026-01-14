package com.example.hyperstyle.dto.request.product;

import com.example.hyperstyle.infrastructure.constant.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateProductRequest {

    @NotBlank
    private String code;

    @NotBlank
    private String name;

    @NotNull
    private Status status;

    @NotBlank(message = "Vui lòng chọn Thương hiệu (Brand)")
    private String brandId; // Dạng UUID String

    @NotBlank(message = "Vui lòng chọn Chất liệu (Material)")
    private String materialId;

    @NotBlank(message = "Vui lòng chọn Đế giày (Sole)")
    private String soleId;

    @NotBlank(message = "Vui lòng chọn Danh mục (Category)")
    private String categoryId;

}
