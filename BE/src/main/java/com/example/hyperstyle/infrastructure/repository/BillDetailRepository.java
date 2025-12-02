package com.example.hyperstyle.infrastructure.repository;

import com.example.hyperstyle.entity.BillDetail;
import com.example.hyperstyle.dto.response.BillDetailResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillDetailRepository extends JpaRepository<BillDetail, String> {

    @Query(value = """
    SELECT new com.example.hyperstyle.dto.response.BillDetailResponse(
        bd.id,
        pd.product.name,
        pd.product.brand.name,
        pd.color.name,
        pd.size.name,
        bd.quantity,
        bd.price,
        (bd.quantity * bd.price)
    )
    FROM BillDetail bd
    JOIN bd.productDetail pd
    WHERE bd.bill.id = :billId
""", nativeQuery = false)
    List<BillDetailResponse> getAllByBillId(String billId);
}