package com.example.hyperstyle.dto.request.account;

import com.example.hyperstyle.dto.request.address.UpdateAddressRequest;
import jakarta.validation.Valid;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateStaffFullRequest {

    @Valid
    private UpdateStaffRequest2 staff;

    @Valid
    private UpdateAddressRequest address;

    @Valid
    private UpdateAccountRequest account;

}
