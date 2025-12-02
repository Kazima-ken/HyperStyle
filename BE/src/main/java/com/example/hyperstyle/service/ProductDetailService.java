package com.example.hyperstyle.service;

import com.example.hyperstyle.entity.ProductDetail;
import com.example.hyperstyle.infrastructure.repository.ProductDetailRepository;
import com.example.hyperstyle.dto.request.ProductDetailRequest; // Cần tạo DTO này
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
public class ProductDetailService {

    private final ProductDetailRepository productDetailRepository;

    // READ: Lấy danh sách phân trang (Ví dụ: trạng thái đang hoạt động = 1)
    public Page<ProductDetail> getAllActive(Pageable pageable) {
        return productDetailRepository.findAllByStatus(pageable, 1);
    }

    // CREATE: Thêm mới ProductDetail
    public ProductDetail create(ProductDetailRequest req) {
        // Cần logic mapping từ Request DTO sang Entity ProductDetail
        ProductDetail newDetail = ProductDetail.builder()
                // ... map các trường như price, quantity, và các Entity liên quan (Product, Color, Size)
                .build();
        return productDetailRepository.save(newDetail);
    }

    // UPDATE: Sửa ProductDetail
    public ProductDetail update(String id, ProductDetailRequest req) {
        ProductDetail detail = productDetailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chi tiết sản phẩm"));

        // ... update các trường như price, quantity...

        return productDetailRepository.save(detail);
    }

    // DELETE (Xóa cứng/mềm tùy quy tắc)
    public void delete(String id) {
        productDetailRepository.deleteById(id);
    }
}