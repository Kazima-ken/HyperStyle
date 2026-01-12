package com.example.hyperstyle.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CartRequest {

    String idAccount;
    private String idProductDetail;
    private Integer quantity;
    private BigDecimal price;
    private String status;

}
