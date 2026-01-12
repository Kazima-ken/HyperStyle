package com.example.hyperstyle.controller.admin;

import com.example.hyperstyle.dto.request.address.CreateAddressRequest;
import com.example.hyperstyle.dto.request.address.FindAddressRequest;
import com.example.hyperstyle.infrastructure.constant.Status;
import com.example.hyperstyle.service.AddressService;
import com.example.hyperstyle.util.ResponseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/address")
@CrossOrigin("*")
public class AddressController {

    @Autowired
    private AddressService addressService;


    @GetMapping()
    public ResponseObject<?> getAll(@ModelAttribute final FindAddressRequest request) {
        return ResponseObject.success(addressService.getList(request));
    }

    @GetMapping("/address-user/{idUser}")
    public ResponseObject<?> getAllByUserId(@PathVariable("idUser") String idUser) {
        return ResponseObject.success(addressService.getAddressByUserId(idUser));
    }

    @PostMapping
    public ResponseObject<?> create(@RequestBody CreateAddressRequest request) {
        return  ResponseObject.success(addressService.create(request));
    }

    @GetMapping("/address-user-status/{id}")
    public ResponseObject<?> getAddressByUserIdAndStatus(@PathVariable String id) {
        return ResponseObject.success(
                addressService.getAddressByUserIdAndStatus(id, Status.DANG_SU_DUNG)
        );
    }



}
