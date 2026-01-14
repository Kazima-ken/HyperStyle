package com.example.hyperstyle.controller.admin;

import com.example.hyperstyle.dto.request.account.CreateStaffFullRequest;
import com.example.hyperstyle.dto.request.account.UpdateStaffFullRequest;
import com.example.hyperstyle.dto.request.staff.FindStaffRequest;
import com.example.hyperstyle.service.StaffService;
import com.example.hyperstyle.util.ResponseObject;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.text.SimpleDateFormat;
import java.util.Set;

@RestController
@RequestMapping("/admin/staff") // 1. Đã sửa URL cho khớp Frontend
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StaffController {

    private final StaffService staffService;


    @GetMapping()
    public ResponseObject<?> getAll(final FindStaffRequest request) {
        return ResponseObject.success(staffService.getAll(request));
    }

    @GetMapping("/{id}")
    public ResponseObject<?> getOne(@PathVariable("id") String id) {
        return ResponseObject.success(staffService.getOneById(id));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseObject<?> createStaff(
            @ModelAttribute CreateStaffFullRequest request,
            @RequestPart(required = false) MultipartFile avatar
    ) {
        staffService.createStaff(request, avatar);
        return ResponseObject.success("Tạo nhân viên thành công");
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseObject<?> updateStaff(
            @PathVariable String id,
            @RequestPart("request") String requestJson,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();

            objectMapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd"));

            UpdateStaffFullRequest request = objectMapper.readValue(requestJson, UpdateStaffFullRequest.class);

            return staffService.updateStaff(id, request, file);

        } catch (JsonProcessingException e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi đọc dữ liệu JSON: " + e.getMessage());
        }
    }
}