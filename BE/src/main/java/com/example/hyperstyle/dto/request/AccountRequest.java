package com.example.hyperstyle.dto.request;

import com.example.hyperstyle.infrastructure.constant.Gender;
import com.example.hyperstyle.infrastructure.constant.Roles;
import com.example.hyperstyle.infrastructure.constant.Status;
import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.util.Date;

@Data
public class AccountRequest {

    // --- Thông tin User (CẦN VALIDATE) ---

    @NotBlank(message = "Tên không được để trống")
    private String fullName;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;

    @NotBlank(message = "Mật khẩu không được để trống")
    private String password;

    @Pattern(regexp = "^(0|\\+84)[0-9]{9,10}$", message = "Số điện thoại không hợp lệ")
    private String phoneNumber;

    private Date dateOfBirth;

    @NotNull(message = "Giới tính không được để trống")
    private Gender gender;

    private String cccd;
    private String avata;

    private Roles roles;

    private Status status;
}