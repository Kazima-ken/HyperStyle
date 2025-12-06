package com.example.hyperstyle.controller.admin;

import com.example.hyperstyle.service.ProductDetailService;
import com.example.hyperstyle.dto.request.ProductDetailRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/admin/product-details")
@RequiredArgsConstructor
public class ProductDetailController {

    private final ProductDetailService productDetailService;

    @GetMapping // READ: Lấy danh sách phân trang (Ví dụ: /api/admin/product-details?page=0&size=10)
    public ResponseEntity<?> getAllActive(Pageable pageable) {
        return ResponseEntity.ok(productDetailService.getAllActive(pageable));
    }

    @PostMapping // CREATE: Thêm mới
    public ResponseEntity<?> create(@RequestBody ProductDetailRequest request) {
        return ResponseEntity.ok(productDetailService.create(request));
    }

    @PutMapping("/{id}") // UPDATE: Cập nhật
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody ProductDetailRequest request) {
        return ResponseEntity.ok(productDetailService.update(id, request));
    }

    @DeleteMapping("/{id}") // DELETE
    public ResponseEntity<?> delete(@PathVariable String id) {
        productDetailService.delete(id);
        return ResponseEntity.noContent().build();
    }
}