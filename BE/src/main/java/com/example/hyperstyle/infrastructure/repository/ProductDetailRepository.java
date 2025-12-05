package com.example.hyperstyle.infrastructure.repository;

import com.example.hyperstyle.entity.ProductDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductDetailRepository extends JpaRepository<ProductDetail, String> {
    // String là kiểu dữ liệu của ID (khóa chính) trong ProductDetail Entity

    // Bạn có thể thêm các phương thức tìm kiếm tùy chỉnh ở đây nếu cần, ví dụ:
    // List<ProductDetail> findByProductId(String productId);
}