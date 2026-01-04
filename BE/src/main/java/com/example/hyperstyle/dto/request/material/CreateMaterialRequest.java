package com.example.hyperstyle.dto.request.material;


import com.example.hyperstyle.infrastructure.constant.Status;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateMaterialRequest {

    @NotBlank(message = "Khong De Trong Ten")
    private String name;

    @NotBlank(message = "Khong De Trong Status")
    private Status status;

}
