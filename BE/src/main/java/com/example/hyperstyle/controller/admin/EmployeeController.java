// File: EmployeeController.java

package com.example.hyperstyle.controller.admin;

import com.example.hyperstyle.dto.request.AccountRequest;
import com.example.hyperstyle.infrastructure.constant.Role; // Cần import Role
import com.example.hyperstyle.service.AccountService;
import com.example.hyperstyle.validation.ValidationGroups; // Dùng lại ValidationGroups đã tạo
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/employee") // <-- ĐỔI PATH NÀY
@RequiredArgsConstructor
public class EmployeeController {

    private final AccountService accountService;

    // READ: Lấy danh sách nhân viên
    @GetMapping
    public ResponseEntity<?> getEmployees() {
        // 🎯 Đổi ROLE_USER thành ROLE_STAFF (hoặc Role bạn định nghĩa cho nhân viên)
        return ResponseEntity.ok(accountService.getAllByRole(Role.ROLE_EMLOYEE));
    }

    // CREATE: Thêm mới nhân viên
    @PostMapping
    public ResponseEntity<?> createEmployee(
            @Validated(ValidationGroups.OnCreate.class) @RequestBody AccountRequest request) {
        // 🎯 Đổi ROLE_USER thành ROLE_STAFF (hoặc Role bạn định nghĩa cho nhân viên)
        return ResponseEntity.ok(accountService.createAccount(request, Role.ROLE_EMLOYEE));
    }

    // UPDATE: Cập nhật thông tin nhân viên
    // Phương thức này dùng chung updateAccount trong Service (đã sửa ở bước trước)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEmployee(
            @PathVariable String id,
            @Validated(ValidationGroups.OnUpdate.class) @RequestBody AccountRequest request) {

        return ResponseEntity.ok(accountService.updateAccount(id, request));
    }

    // DELETE: Xóa (Soft Delete) nhân viên
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable String id) {
        accountService.deleteAccount(id);
        return ResponseEntity.noContent().build();
    }
}