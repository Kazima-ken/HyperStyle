package com.example.hyperstyle.repository;

import com.example.hyperstyle.entity.ProductDetail;
import com.example.hyperstyle.infrastructure.constant.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface ProductDetailRepository extends JpaRepository<ProductDetail, String> {
    // READ: Lấy danh sách ProductDetail theo trạng thái (Ví dụ: trạng thái đang bán)
    Page<ProductDetail> findAllByStatus(Pageable pageable, Status status);


    @Query("""
        SELECT pd FROM ProductDetail pd
        JOIN FETCH pd.product p
        JOIN FETCH pd.color c
        JOIN FETCH pd.size s
        WHERE pd.id = :id
    """)
    Optional<ProductDetail> findDetailWithRelations(@Param("id") String id);
}