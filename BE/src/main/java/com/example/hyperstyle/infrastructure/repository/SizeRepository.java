package com.example.hyperstyle.infrastructure.repository;

import com.example.hyperstyle.entity.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SizeRepository extends JpaRepository<Size, String> {
    // String là kiểu dữ liệu của ID (khóa chính) trong Size Entity
}