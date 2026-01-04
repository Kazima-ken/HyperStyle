package com.example.hyperstyle.controller.admin;

import com.example.hyperstyle.dto.request.AccountRequest;
import com.example.hyperstyle.dto.request.staff.FindStaffRequest;
import com.example.hyperstyle.infrastructure.constant.Roles;
import com.example.hyperstyle.infrastructure.constant.Roles;
import com.example.hyperstyle.service.AccountServiceClass;
import com.example.hyperstyle.service.CustomerService;
import com.example.hyperstyle.util.ResponseObject;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/customers")
@RequiredArgsConstructor
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @GetMapping()
    public ResponseObject<?> getAll(final FindStaffRequest request) {
        return ResponseObject.success(customerService.findAll(request));
    }

//    @PostMapping
//    public ResponseEntity<?> createCustomer(@RequestBody @Valid AccountRequest request) { // 🎯 FIX LỖI 2: Kích hoạt Validation
//        return ResponseEntity.ok(accountServiceClass.createAccount(request, Roles.ROLE_USER));
//    }
//
//    @PutMapping("/{id}") // UPDATE: Cập nhật
//    public ResponseEntity<?> updateCustomer(@PathVariable String id, @RequestBody @Valid AccountRequest request) {
//        return ResponseEntity.ok(accountServiceClass.updateAccount(id, request));
//    }
//
//    @DeleteMapping("/{id}") // DELETE: Xóa mềm
//    public ResponseEntity<?> softDeleteCustomer(@PathVariable String id) {
//        accountServiceClass.deleteAccount(id);
//        return ResponseEntity.noContent().build();
//    }
}