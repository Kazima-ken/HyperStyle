package com.example.hyperstyle.infrastructure.repository;

import com.example.hyperstyle.dto.response.BillDetailResponse;
import com.example.hyperstyle.entity.BillDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface BillDetailRepository extends JpaRepository<BillDetail, String> {

    @Query(value = """
        SELECT new com.example.hyperstyle.dto.response.BillDetailResponse(
            bd.id,
            pd.product.name,
            pd.color.name,
            pd.size.name,
            bd.quantity,
            bd.price,
            (bd.quantity * bd.price)
        )
        FROM BillDetail bd
        JOIN bd.productDetail pd
        WHERE bd.bill.id = :billId
    """)
        // Lưu ý: Tùy thuộc vào cấu trúc BillDetailResponse DTO của bạn,
        // bạn có thể cần phải sửa đổi constructor của DTO đó để bỏ tham số 'brandName'
    List<BillDetailResponse> getAllByBillId(@Param("billId") String billId);

}