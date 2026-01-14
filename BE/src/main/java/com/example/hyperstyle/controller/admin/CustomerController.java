package com.example.hyperstyle.controller.admin;

import com.example.hyperstyle.dto.request.AccountRequest;
import com.example.hyperstyle.dto.request.address.UpdateAddressRequest;
import com.example.hyperstyle.dto.request.customer.FindCustomerRequest;
import com.example.hyperstyle.dto.request.customer.UpdateCustomerRequest;
import com.example.hyperstyle.dto.request.image.ImageRequest;
import com.example.hyperstyle.dto.request.staff.FindStaffRequest;
import com.example.hyperstyle.entity.User;
import com.example.hyperstyle.infrastructure.constant.Roles;
import com.example.hyperstyle.infrastructure.constant.Roles;
import com.example.hyperstyle.infrastructure.exception.rest.RestApiException;
import com.example.hyperstyle.service.AccountServiceClass;
import com.example.hyperstyle.service.CustomerService;
import com.example.hyperstyle.util.ResponseObject;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.cloudinary.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/admin/customers")
@RequiredArgsConstructor
public class CustomerController {

    @Autowired
    private CustomerService customerService;


    @GetMapping()
    public ResponseObject<?> getAll(final FindCustomerRequest request) {
        return ResponseObject.success(customerService.findAll(request));
    }

    @GetMapping("/{id}")
    public ResponseObject<?> getOneById(@PathVariable("id") String id) {
        return ResponseObject.success(customerService.getOneById(id));
    }

    //    @PostMapping
//    public ResponseEntity<?> createCustomer(@RequestBody @Valid AccountRequest request) { // 🎯 FIX LỖI 2: Kích hoạt Validation
//        return ResponseEntity.ok(accountServiceClass.createAccount(request, Roles.ROLE_USER));
//    }
//
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateCustomer(
            @PathVariable("id") String id, // <--- 1. Nhận ID từ URL

            @RequestPart("customer") @Valid UpdateCustomerRequest request, // 2. Nhận thông tin user
            @RequestPart(value = "address", required = false) @Valid UpdateAddressRequest addressRequest, // 3. Nhận địa chỉ
            @RequestPart(value = "file", required = false) MultipartFile file // 4. Nhận file ảnh
    ) {
        try {
            // 5. Gán ID từ URL vào Request DTO để đảm bảo tính nhất quán
            // (Tránh trường hợp URL là id=1 nhưng trong json lại gửi id=2)
            request.setId(id);

            User updatedUser = customerService.update(request, addressRequest, file);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi hệ thống: " + e.getMessage());
        }
    }

}