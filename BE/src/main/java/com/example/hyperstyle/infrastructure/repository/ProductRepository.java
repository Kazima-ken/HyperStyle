package com.example.hyperstyle.infrastructure.repository;
import com.example.hyperstyle.entity.Product; // Đảm bảo Entity Product đã tồn tại
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
}
