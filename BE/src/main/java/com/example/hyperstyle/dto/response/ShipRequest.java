package com.example.hyperstyle.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ShipRequest {

    private BigDecimal ship ;

    private String idBill;

}
