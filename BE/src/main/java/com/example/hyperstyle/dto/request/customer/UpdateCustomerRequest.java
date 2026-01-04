package com.example.hyperstyle.dto.request.customer;

import com.example.hyperstyle.infrastructure.constant.Status;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateCustomerRequest {

    private String id;

    @NotBlank(message = "Vui Lòng Không Để Trống Tên")
    private String fullName;

    @NotBlank(message = "Vui Lòng Không Để Trống Ngày Sinh")
    private Long dateOfBirth;

    @NotBlank(message = "Vui Lòng Không Để Trống Số Điện Thoại")
    private String phoneNumber;

    @NotBlank(message = "Vui Lòng Không Để Trống Email")
    private String email;

    private Boolean gender;

    private String avata;

    private Status status;

    private String password;

    private String citizenIdentity;

}
