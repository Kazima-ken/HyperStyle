package com.example.hyperstyle.dto.request.bill;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BillRequest {
    private String key;
    private List<String> status;
    private String type;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date startDate;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date endDate;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date startDeliveryDate;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date endDeliveryDate;

    private String staff;
    private String user;
    private String phoneNumber;

    // Thêm trường này để hỗ trợ logic kiểm tra null trong SQL
    private String converStatus;
}
