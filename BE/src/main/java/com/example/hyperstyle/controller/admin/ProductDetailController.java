package com.example.hyperstyle.controller.admin;

import com.example.hyperstyle.entity.ProductDetail;
import com.example.hyperstyle.dto.request.ProductDetailRequest;
import com.example.hyperstyle.service.ProductDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/product-details")
public class ProductDetailController {

    @Autowired
    private ProductDetailService productDetailService;

    // GET - Endpoint đã hoạt động
    @GetMapping
    public ResponseEntity<Page<ProductDetail>> getAllActive(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(productDetailService.getAllActive(pageable));
    }

    // POST - Endpoint mới: Tạo mới chi tiết sản phẩm
    @PostMapping
    public ResponseEntity<ProductDetail> createProductDetail(@Valid @RequestBody ProductDetailRequest request) {
        ProductDetail createdDetail = productDetailService.create(request);
        return ResponseEntity.status(201).body(createdDetail);
    }

    // PUT - Endpoint mới: Cập nhật chi tiết sản phẩm
    @PutMapping("/{id}")
    public ResponseEntity<ProductDetail> updateProductDetail(
            @PathVariable("id") String id,
            @Valid @RequestBody ProductDetailRequest request
    ) {
        ProductDetail updatedDetail = productDetailService.update(id, request);
        return ResponseEntity.ok(updatedDetail);
    }
}