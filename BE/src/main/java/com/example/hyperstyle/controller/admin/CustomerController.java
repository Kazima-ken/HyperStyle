package com.example.hyperstyle.controller.admin;

import com.example.hyperstyle.dto.request.AccountRequest;
import com.example.hyperstyle.infrastructure.constant.Roles;
import com.example.hyperstyle.infrastructure.constant.Roles;
import com.example.hyperstyle.service.AccountServiceClass;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final AccountServiceClass accountServiceClass;

    @GetMapping // READ: Lấy danh sách
    public ResponseEntity<?> getCustomers() {
        return ResponseEntity.ok(accountServiceClass.getAllByRoles(Roles.ROLE_USER));
    }

    @PostMapping // CREATE: Thêm mới
    public ResponseEntity<?> createCustomer(@RequestBody @Valid AccountRequest request) { // 🎯 FIX LỖI 2: Kích hoạt Validation
        return ResponseEntity.ok(accountServiceClass.createAccount(request, Roles.ROLE_USER));
    }

    @PutMapping("/{id}") // UPDATE: Cập nhật
    public ResponseEntity<?> updateCustomer(@PathVariable String id, @RequestBody @Valid AccountRequest request) {
        return ResponseEntity.ok(accountServiceClass.updateAccount(id, request));
    }

    @DeleteMapping("/{id}") // DELETE: Xóa mềm
    public ResponseEntity<?> softDeleteCustomer(@PathVariable String id) {
        accountServiceClass.deleteAccount(id);
        return ResponseEntity.noContent().build();
    }
}