package com.example.hyperstyle.dto.request.bill;

import com.example.hyperstyle.dto.request.Payment.CreatePaymentsMethodRequest;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;


@Getter
@Setter
public class CreateBillRequest {

    private String phoneNumber;

    private String idUser;

    private String address;

    private String userName;

    @NotEmpty
    private String totalMoney;

    private String note;

    @NotEmpty
    private String typeBill;

    @NotEmpty
    private String code;

    @NotEmpty
    private String statusPayMents;

    private String deliveryDate;

    private boolean openDelivery;

    private String moneyShip;

    private String email;

    private BigDecimal totalExcessMoney;

    @NotNull
    private List<CreateBillDetailRequest> billDetailRequests;

    @NotNull
    private List<CreatePaymentsMethodRequest> paymentsMethodRequests;


}
