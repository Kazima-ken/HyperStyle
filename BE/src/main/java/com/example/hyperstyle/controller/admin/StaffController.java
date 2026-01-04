package com.example.hyperstyle.controller.admin;

import com.example.hyperstyle.dto.request.AccountRequest;
import com.example.hyperstyle.dto.request.staff.FindStaffRequest;
import com.example.hyperstyle.infrastructure.constant.Roles;
import com.example.hyperstyle.service.AccountServiceClass;
import com.example.hyperstyle.service.StaffService;
import com.example.hyperstyle.service.UserService;
import com.example.hyperstyle.util.ResponseObject;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/staff")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    @GetMapping()
    public ResponseObject<?> getAll(final FindStaffRequest request) {
        return ResponseObject.success(staffService.getAll(request));
    }

//    @PostMapping // CREATE: Thêm mới
//    public ResponseEntity<?> createEmployee(@RequestBody AccountRequest request) {
//        return ResponseEntity.ok(accountServiceClass.createAccount(request, Roles.ROLE_EMLOYEE));
//    }
//
//    @PutMapping("/{id}") // UPDATE: Cập nhật
//    public ResponseEntity<?> updateEmployee(@PathVariable String id, @RequestBody AccountRequest request) {
//        return ResponseEntity.ok(accountServiceClass.updateAccount(id, request));
//    }
//
//    @DeleteMapping("/{id}") // DELETE: Xóa mềm
//    public ResponseEntity<?> softDeleteEmployee(@PathVariable String id) {
//        accountServiceClass.deleteAccount(id);
//        return ResponseEntity.noContent().build();
//    }
}