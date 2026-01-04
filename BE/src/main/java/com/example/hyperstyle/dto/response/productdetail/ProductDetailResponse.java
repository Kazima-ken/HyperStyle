package com.example.hyperstyle.dto.response.productdetail;

import com.example.hyperstyle.entity.ProductDetail;
import com.example.hyperstyle.infrastructure.constant.Status;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.math.BigDecimal;

@Projection(types = ProductDetail.class)
public interface ProductDetailResponse {

    @Value("#{target.id}")
    String getId();

    @Value("#{target.stt}")
    Integer getSTT();

    @Value("#{target.nameProduct}")
    String getNameProduct();

    @Value("#{target.image}")
    String getImage();

    @Value("#{target.price}")
    BigDecimal getPrice();

    @Value("#{target.quantity}")
    String getQuantity();

    @Value("#{target.color}")
    String getColor();

    @Value("#{target.size}")
    String getSize();

    @Value("#{target.createdDate}")
    String getCreatedDate();

    @Value("#{target.status}")
    Status getStatus();

}
