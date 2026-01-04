package com.example.hyperstyle.dto.request.category;

import com.example.hyperstyle.infrastructure.constant.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateCategoryRequest {

    private String id;

    @NotBlank(message = "Khong De Trong Ten")
    private String name;

    @NotNull(message = "Khong De Trong Status")
    private Status status;

}
