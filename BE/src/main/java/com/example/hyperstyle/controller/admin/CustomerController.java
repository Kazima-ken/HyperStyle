package com.example.hyperstyle.controller.admin;

import com.example.hyperstyle.dto.request.AccountRequest;
import com.example.hyperstyle.infrastructure.constant.Role;
import com.example.hyperstyle.service.AccountService;
import com.example.hyperstyle.validation.ValidationGroups; // <-- Import ValidationGroups
import org.springframework.validation.annotation.Validated;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final AccountService accountService;

    @GetMapping // READ: Lấy danh sách
    public ResponseEntity<?> getCustomers() {
        return ResponseEntity.ok(accountService.getAllByRole(Role.ROLE_USER));
    }

    @PostMapping // CREATE: Bắt buộc nhập mật khẩu
    public ResponseEntity<?> createCustomer(@Validated(ValidationGroups.OnCreate.class) @RequestBody AccountRequest request) {
        // ...
        return ResponseEntity.ok(accountService.createAccount(request, Role.ROLE_USER));
    }

    @PutMapping("/{id}") // UPDATE: KHÔNG bắt buộc nhập mật khẩu
    public ResponseEntity<?> updateCustomer(@PathVariable String id,
                                            @Validated(ValidationGroups.OnUpdate.class) @RequestBody AccountRequest request) { // Dùng OnUpdate
        // ...
        return ResponseEntity.ok(accountService.updateAccount(id, request));
    }

    @DeleteMapping("/{id}") // DELETE: Xóa mềm
    public ResponseEntity<?> softDeleteCustomer(@PathVariable String id) {
        accountService.deleteAccount(id);
        return ResponseEntity.noContent().build();
    }
}