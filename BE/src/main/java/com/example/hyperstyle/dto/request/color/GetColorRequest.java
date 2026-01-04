package com.example.hyperstyle.dto.request.color;

import com.example.hyperstyle.infrastructure.common.PageableRequest;
import com.example.hyperstyle.infrastructure.constant.Status;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GetColorRequest extends PageableRequest {

    private String code;

    private String name;

    private Status status;


}
