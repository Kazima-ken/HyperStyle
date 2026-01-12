package com.example.hyperstyle.dto.response.bill;

import com.example.hyperstyle.entity.Address;
import com.example.hyperstyle.entity.Bill;
import com.example.hyperstyle.entity.User;
import org.attoparser.trace.MarkupTraceEvent;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.math.BigDecimal;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;
import java.util.Date;

public interface BillResponse {

    Integer getStt();

    String getId();

    String getCode();

    Date getCreatedDate();

    Date getLastModifiedDate();

    String getUserName();

    String getNameEmployees();

    String getType();

    String getStatusBill();

    BigDecimal getTotalMoney();

    BigDecimal getItemDiscount();

    String getNote();

    String getPhoneNumber();
}

