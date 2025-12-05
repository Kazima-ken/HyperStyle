package com.example.hyperstyle.service;

import com.example.hyperstyle.entity.ProductDetail;
// Đảm bảo bạn sử dụng đúng package cho ProductDetailRequest
import com.example.hyperstyle.dto.request.ProductDetailRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductDetailService {

    // Phương thức đã có
    Page<ProductDetail> getAllActive(Pageable pageable);

    // Phương thức mới: Tạo mới chi tiết sản phẩm
    ProductDetail create(ProductDetailRequest request);

    // Phương thức mới: Cập nhật chi tiết sản phẩm
    ProductDetail update(String id, ProductDetailRequest request);
}