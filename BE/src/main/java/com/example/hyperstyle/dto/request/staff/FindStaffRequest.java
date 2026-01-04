package com.example.hyperstyle.dto.request.staff;


import com.example.hyperstyle.infrastructure.common.PageableRequest;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class FindStaffRequest extends PageableRequest {
    private String fullName;

    private String email;

    private String phoneNumber;

    private String status;

    private Long startTime;

    private Long endTime;

    private Integer minAge;

    private Integer maxAge;
}