package com.example.hyperstyle.dto.request.bill;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BillDetailRequest {

    private String idBill;

    private String status;

    public String getStatus() {
        return status != null ? status.trim() : null;
    }

    public String getIdBill() {
        return idBill != null ? idBill.trim() : null;
    }

}
