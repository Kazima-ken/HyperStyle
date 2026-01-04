package com.example.hyperstyle.dto.request.address;

import com.example.hyperstyle.infrastructure.common.PageableRequest;
import com.example.hyperstyle.infrastructure.constant.Status;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FindAddressRequest extends PageableRequest {

    private String line;

    private String district;

    private String province;

    private String ward;

    private Status status;

    private String id_user;

}