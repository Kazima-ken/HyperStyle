package com.example.hyperstyle.controller.admin;

import com.example.hyperstyle.dto.request.address.FindAddressRequest;
import com.example.hyperstyle.service.AddressService;
import com.example.hyperstyle.util.ResponseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/address")
@CrossOrigin("*")
public class AddressController {

    @Autowired
    private AddressService addressService;


    @GetMapping()
    public ResponseObject<?> view(@ModelAttribute final FindAddressRequest request) {
        return ResponseObject.success(addressService.getList(request));
    }
}
