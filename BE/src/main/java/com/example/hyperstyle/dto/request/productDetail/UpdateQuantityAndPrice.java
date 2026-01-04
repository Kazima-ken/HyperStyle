package com.example.hyperstyle.dto.request.productDetail;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateQuantityAndPrice {

    private String id;

    private BigDecimal price;

    private int quantity;

}
