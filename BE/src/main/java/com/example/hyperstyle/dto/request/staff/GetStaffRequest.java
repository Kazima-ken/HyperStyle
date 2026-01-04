package com.example.hyperstyle.dto.request.staff;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class GetStaffRequest {

    private String fullName;

    private String email;

    private String phoneNumber;

    private String status;

    private Long startTime;

    private Long endTime;

    private Integer minAge;

    private Integer maxAge;


}
