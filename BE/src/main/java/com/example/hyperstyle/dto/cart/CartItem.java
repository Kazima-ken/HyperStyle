package com.example.hyperstyle.dto.cart;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartItem implements Serializable {

    // ID của ProductDetail (BẮT BUỘC)
    private String productDetailId;

    private String productName;
    private String imageUrl;
    private String color;
    private String size;

    private BigDecimal price;
    private int quantity;
}
