package com.example.hyperstyle.controller.admin;

import com.example.hyperstyle.dto.request.address.CreateAddressRequest;
import com.example.hyperstyle.dto.request.address.FindAddressRequest;
import com.example.hyperstyle.dto.request.address.UpdateAddressRequest;
import com.example.hyperstyle.entity.Address;
import com.example.hyperstyle.infrastructure.constant.Status;
import com.example.hyperstyle.service.AddressService;
import com.example.hyperstyle.util.ResponseObject;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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

    @GetMapping("/address-account/{id}")
    public ResponseObject<?> getAllByAccountId(@PathVariable String id) {
        return ResponseObject.success(addressService.getAddressByAccountId(id));
    }


    @PostMapping
    public ResponseObject<?> create(@RequestBody CreateAddressRequest request) {
        return ResponseObject.success(addressService.create(request));
    }

    @PostMapping("/account")
    public ResponseObject<?> createByAccount(@RequestBody CreateAddressRequest request) {
        return ResponseObject.success(addressService.createByAccount(request));
    }


    @GetMapping("/address-user-status/{id}")
    public ResponseObject<?> getAddressByUserIdAndStatus(@PathVariable String id) {
        return ResponseObject.success(
                addressService.getAddressByUserIdAndStatus(id, Status.DANG_SU_DUNG)
        );
    }

    @GetMapping("/address-account-status/{id}")
    public ResponseObject<?> getAddressByUserAccountAndStatus(@PathVariable String id) {
        return ResponseObject.success(
                addressService.getAddressByUserAccountAndStatus(id, Status.DANG_SU_DUNG)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject<Address>> getOne(@PathVariable("id") String id) {
        try {
            Address address = addressService.getOne(id);
            return ResponseEntity.ok(ResponseObject.success(address));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ResponseObject.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject<Address>> update(@PathVariable("id") String id,
                                                          @RequestBody @Valid UpdateAddressRequest request) {
        try {
            Address updatedAddress = addressService.update(id, request);
            return ResponseEntity.ok(ResponseObject.success("Cập nhật thành công", updatedAddress));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(ResponseObject.error(e.getMessage()));
        }
    }


}
