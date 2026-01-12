package com.example.hyperstyle.dto.response.productdetail;

import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;

public interface GetByProductDetail {
    String getId();

    // Các trường hiển thị text
    @Value("#{target.nameProduct}")
    String getNameProduct();

    @Value("#{target.description}")
        // Thêm mô tả
    String getDescription();

    BigDecimal getPrice();

    Integer getQuantity();

    String getGender();

    String getStatus();

    @Value("#{target.idCategory}")
    String getIdCategory();

    @Value("#{target.idMaterial}")
    String getIdMaterial();

    @Value("#{target.idBrand}")
    String getIdBrand();

    @Value("#{target.idSole}")
    String getIdSole();

    @Value("#{target.idSize}")
    String getIdSize();

    @Value("#{target.idColor}")
    String getIdColor();

    @Value("#{target.image}")
    String getImage();
}
