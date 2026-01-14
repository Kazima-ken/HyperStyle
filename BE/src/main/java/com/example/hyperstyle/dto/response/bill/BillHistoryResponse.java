package com.example.hyperstyle.dto.response.bill;

import com.example.hyperstyle.entity.Bill;
import com.example.hyperstyle.entity.BillHistory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.util.Date;

@Projection(types = {Bill.class, BillHistory.class})
public interface BillHistoryResponse {

    @Value("#{target.stt}")
    String getStt();

    @Value("#{target.id}")
    String getId();

    @Value("#{target.status_bill}")
    String getBillStatus();

    @Value("#{target.created_date}")
    Date getCreateDate();

    @Value("#{target.action_description}")
    String getActionDesc();

    @Value("#{target.full_name}")
    String getFullName();

}
