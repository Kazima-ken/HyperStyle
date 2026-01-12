package com.example.hyperstyle.dto.response.bill;

import org.springframework.beans.factory.annotation.Value;

public interface FindBillByStatusRespose {

    // Ánh xạ với cột "status_bill" trong câu SQL
    @Value("#{target.status_bill}")
    String getStatus();

    // Ánh xạ với cột "quantity" trong câu SQL
    @Value("#{target.quantity}")
    Integer getQuantity(); // Nên để Integer hoặc Long vì count trả về số
}
