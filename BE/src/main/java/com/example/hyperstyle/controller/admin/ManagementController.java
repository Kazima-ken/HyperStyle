package com.example.hyperstyle.controller.admin;

import com.example.hyperstyle.infrastructure.constant.Role;
import com.example.hyperstyle.dto.request.AccountRequest;
import com.example.hyperstyle.infrastructure.repository.BillDetailRepository;
import com.example.hyperstyle.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ManagementController {

    private final AccountService accountService;
    private final BillDetailRepository billDetailRepository;

    // --- API CHO NHÂN VIÊN (ROLE_EMLOYEE) ---

    @GetMapping("/employees") // READ DS Nhân viên
    public ResponseEntity<?> getEmployees() {
        return ResponseEntity.ok(accountService.getAllByRole(Role.ROLE_EMLOYEE));
    }

    @PostMapping("/employees") // CREATE Nhân viên
    public ResponseEntity<?> createEmployee(@RequestBody AccountRequest request) {
        return ResponseEntity.ok(accountService.createAccount(request, Role.ROLE_EMLOYEE));
    }

    @DeleteMapping("/employees/{id}") // DELETE (Soft Delete)
    public ResponseEntity<?> softDeleteEmployee(@PathVariable String id) {
        accountService.deleteAccount(id);
        return ResponseEntity.ok("Xóa mềm nhân viên thành công.");
    }

    // --- API CHO KHÁCH HÀNG (ROLE_USER) ---

    @GetMapping("/customers") // READ DS Khách hàng
    public ResponseEntity<?> getCustomers() {
        return ResponseEntity.ok(accountService.getAllByRole(Role.ROLE_USER));
    }

    @PostMapping("/customers") // CREATE Khách hàng
    public ResponseEntity<?> createCustomer(@RequestBody AccountRequest request) {
        return ResponseEntity.ok(accountService.createAccount(request, Role.ROLE_USER));
    }

    // --- API UPDATE CHUNG CHO CẢ NHÂN VIÊN VÀ KHÁCH HÀNG ---

    @PutMapping("/accounts/{id}")
    public ResponseEntity<?> updateAccountInfo(@PathVariable String id, @RequestBody AccountRequest request) {
        // Cập nhật thông tin cá nhân (tên, sđt, ngày sinh...)
        return ResponseEntity.ok(accountService.updateAccount(id, request));
    }

    // --- CHI TIẾT HÓA ĐƠN --- (Sẽ code ở phần 3)
}