package com.example.hyperstyle.dto.request.bill;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Getter
@Setter
public class CreateBillAccountOnlineRequest {

    private String userName;
    private String phoneNumber;
    private String address;
    private BigDecimal moneyShip;
    private BigDecimal totalMoney;
    private String paymentMethod; // "paymentReceive" hoặc "paymentVnPay"
    private List<BillDetailOnline> billDetail;

    private Date shippingTime;

    private String idAccount;

    private PaymentInfo responsePayment;

    @Getter
    @Setter
    public static class PaymentInfo {
        private String vnp_TxnRef;
        private String vnp_TransactionNo;
        private String vnp_PayDate;
        private String vnp_ResponseCode;
    }
}
