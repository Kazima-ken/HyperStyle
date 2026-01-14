package com.example.hyperstyle.dto.response.product;

import com.example.hyperstyle.entity.Product;
import com.example.hyperstyle.infrastructure.constant.Status;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

@Projection(types = Product.class)
public interface ProductResponse {

    @Value("#{target.stt}")
    Integer getSTT();

    @Value("#{target.id}")
    String getId();

    @Value("#{target.nameProduct}")
    String getName();

    @Value("#{target.image}")
    String getImage();

    @Value("#{target.status}")
    String getStatus();

    @Value("#{target.code}")
    String getCode();

    @Value("#{target.nameSole}")
    String getNameSole();

    @Value("#{target.nameCategory}")
    String getNameCategory();

    @Value("#{target.nameMaterial}")
    String getNameMaterial();

    @Value("#{target.nameBrand}")
    String getNameBrand();

    @Value("#{target.totalQuantity}")
    Integer getTotalQuantity();

    @Value("#{target.price}") // Tên 'price' phải khớp với tên cột/alias trong SQL của bạn
    Double getPrice();

}
