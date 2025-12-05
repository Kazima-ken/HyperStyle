package com.example.hyperstyle.infrastructure.repository;

import com.example.hyperstyle.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    // String là kiểu dữ liệu của ID (khóa chính) trong Product Entity
}