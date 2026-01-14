package com.example.hyperstyle.dto.request.brand;


import com.example.hyperstyle.infrastructure.constant.Status;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateBrandRequest {

    @NotBlank(message = "Khong De Trong Ten")
    private String name;

    @NotBlank(message = "Khong De Trong Status")
    private Status status;

}
