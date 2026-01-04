package com.example.hyperstyle.dto.request.brand;

import com.example.hyperstyle.infrastructure.common.PageableRequest;
import com.example.hyperstyle.infrastructure.constant.Status;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GetBrandRequest extends PageableRequest {

    private String name;

    private Status status;

}
