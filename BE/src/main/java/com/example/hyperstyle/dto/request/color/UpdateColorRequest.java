package com.example.hyperstyle.dto.request.color;

import com.example.hyperstyle.infrastructure.constant.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateColorRequest {

    private String id;

    @NotBlank(message = "Không Để Trống Code")
    private String Code;

    @NotBlank(message = "Không Để Trống Tên")
    private String name;

    @NotNull(message = "Không Để Trống Status")
    private Status status;

}
