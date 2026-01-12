package com.example.hyperstyle.dto.request.staff;

import com.example.hyperstyle.infrastructure.constant.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Getter
@Setter
public class CreateStaffRequest {

    @NotBlank(message = "Vui Lòng Không Để Trống Tên")
    private String fullName;

    @NotNull(message = "Ngày sinh không được để trống")
    @Past(message = "Ngày sinh phải là ngày trong quá khứ")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date dateOfBirth;

    @NotBlank(message = "Vui Lòng Không Để Trống Số Điện Thoại")
    private String phoneNumber;

    @NotBlank(message = "Vui Lòng Không Để Trống Email")
    private String email;

    private Boolean gender;

    private String avata;

    private Status status;

    private String citizenIdentity;

}
