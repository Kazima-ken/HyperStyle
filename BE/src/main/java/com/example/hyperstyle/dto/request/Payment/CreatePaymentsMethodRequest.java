package com.example.hyperstyle.dto.request.Payment;

import com.example.hyperstyle.infrastructure.constant.Method;
import com.example.hyperstyle.infrastructure.constant.PaymentStatus;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CreatePaymentsMethodRequest {

    private String actionDescription;

    private BigDecimal totalMoney;

    private Method method;

    private PaymentStatus status;

    private String transaction;

}
