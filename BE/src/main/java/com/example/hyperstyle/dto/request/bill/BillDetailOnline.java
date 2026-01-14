package com.example.hyperstyle.dto.request.bill;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class BillDetailOnline {
    private String  idProductDetail;
    private BigDecimal price;
    private Integer quantity;

}
