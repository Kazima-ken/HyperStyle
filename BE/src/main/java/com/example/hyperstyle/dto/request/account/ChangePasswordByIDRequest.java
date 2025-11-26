package com.example.hyperstyle.dto.request.account;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordByIDRequest {

    private String id;

    @NotBlank(message = "Nhập mật khẩu hiện tại")
    private String password;

    @NotBlank(message = "Nhập mật khẩu mới")
    private String newPassword;

    @NotBlank(message = "Xác nhận mật khẩu mới")
    private String confirmPassword;

}
