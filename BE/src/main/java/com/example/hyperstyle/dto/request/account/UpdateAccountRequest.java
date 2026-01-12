package com.example.hyperstyle.dto.request.account;

import com.example.hyperstyle.infrastructure.constant.Roles;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class UpdateAccountRequest {

    private String id;

    @NotBlank(message = "Email trống")
    @Email(message = "Email không hợp lệ")
    private String email;

    private String password;

    @NotNull(message = "Vui lòng chọn vai trò")
    private Roles roles;

    @NotBlank(message = "Số điện thoại trống")
    @Pattern(regexp = "^[0-9]{10,15}$", message = "Số điện thoại không hợp lệ")
    private String numberPhone;

}
