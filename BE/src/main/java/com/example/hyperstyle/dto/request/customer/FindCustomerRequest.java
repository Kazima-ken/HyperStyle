package com.example.hyperstyle.dto.request.customer;


import com.example.hyperstyle.infrastructure.common.PageableRequest;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FindCustomerRequest extends PageableRequest {

    private String fullName;

    private String email;

    private String phoneNumber;

    private String status;

    private Long startTime;

    private Long endTime;

    private Integer minAge;

    private Integer maxAge;

    private String keyword;

}
