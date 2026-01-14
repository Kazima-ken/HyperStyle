package com.example.hyperstyle.dto.request.product;

import com.example.hyperstyle.entity.Product;
import com.example.hyperstyle.infrastructure.constant.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReturnCreateProduct {

    private String id;

    private String code;

    private String name;

    private Status status;

    private String categoryId;

    private String materialId;

    private String soleId;

    private String brandId;

    public ReturnCreateProduct(Product product) {
        this.id = product.getId();
        this.code =product.getCode();
        this.name =product.getName();
        this.brandId = product.getBrand().getId();
        this.categoryId = product.getCategory().getId();
        this.materialId = product.getMaterial().getId();
        this.soleId = product.getSole().getId();
        this.status = product.getStatus();
    }

}
