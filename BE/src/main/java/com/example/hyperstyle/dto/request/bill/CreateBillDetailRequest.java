package com.example.hyperstyle.dto.request.bill;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateBillDetailRequest {

    @NotEmpty
    private String idBill;

    @NotEmpty
    private String idProduct;

    @NotNull
    private int quantity;

    @NotEmpty
    private String totalMoney;

    @NotEmpty
    private String price;

    private String note;
}