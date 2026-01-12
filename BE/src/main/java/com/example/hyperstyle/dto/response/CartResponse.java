package com.example.hyperstyle.dto.response;

import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;

public interface CartResponse {

    String getIdCart();
    String getIdProduct();
    String getIdProductDetail();

    String getNameProduct();
    String getNameSize();
    String getCodeColor();

    String getImage();
    BigDecimal getPrice();
    Integer getQuantity();

    Integer getQuantityProductDetail();
}


