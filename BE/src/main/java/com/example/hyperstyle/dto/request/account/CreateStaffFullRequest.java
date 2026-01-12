package com.example.hyperstyle.dto.request.account;

import com.example.hyperstyle.dto.request.address.CreateAddressRequest;
import com.example.hyperstyle.dto.request.staff.CreateStaffRequest;
import jakarta.validation.Valid;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateStaffFullRequest {

    @Valid
    private CreateStaffRequest staff;

    @Valid
    private CreateAddressRequest address;

    @Valid
    private CreateAccountRequest account;
}
