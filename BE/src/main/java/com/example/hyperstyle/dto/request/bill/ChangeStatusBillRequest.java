package com.example.hyperstyle.dto.request.bill;

import com.example.hyperstyle.infrastructure.constant.BillStatus;
import com.example.hyperstyle.infrastructure.constant.Method;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangeStatusBillRequest {

    @NotEmpty
    private String actionDescription;

    private Method method;

    private String totalMoney;

    private boolean statusCancel;

    private BillStatus newStatus;
}
