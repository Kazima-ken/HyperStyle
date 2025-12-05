package com.example.hyperstyle.infrastructure.repository;

import com.example.hyperstyle.entity.Color;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ColorRepository extends JpaRepository<Color, String> {
    // String là kiểu dữ liệu của ID (khóa chính) trong Color Entity
}