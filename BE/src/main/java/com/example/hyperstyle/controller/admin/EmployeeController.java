package com.example.hyperstyle.controller.admin;

import com.example.hyperstyle.dto.request.AccountRequest;
import com.example.hyperstyle.infrastructure.constant.Role;
import com.example.hyperstyle.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final AccountService accountService;

    @GetMapping // READ: Lấy danh sách
    public ResponseEntity<?> getEmployees() {
        return ResponseEntity.ok(accountService.getAllByRole(Role.ROLE_EMLOYEE));
    }

    @PostMapping // CREATE: Thêm mới
    public ResponseEntity<?> createEmployee(@RequestBody AccountRequest request) {
        return ResponseEntity.ok(accountService.createAccount(request, Role.ROLE_EMLOYEE));
    }

    @PutMapping("/{id}") // UPDATE: Cập nhật
    public ResponseEntity<?> updateEmployee(@PathVariable String id, @RequestBody AccountRequest request) {
        return ResponseEntity.ok(accountService.updateAccount(id, request));
    }

    @DeleteMapping("/{id}") // DELETE: Xóa mềm
    public ResponseEntity<?> softDeleteEmployee(@PathVariable String id) {
        accountService.deleteAccount(id);
        return ResponseEntity.noContent().build();
    }
}