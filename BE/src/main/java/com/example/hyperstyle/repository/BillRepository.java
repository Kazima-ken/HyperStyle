package com.example.hyperstyle.repository;

import com.example.hyperstyle.dto.request.bill.BillRequest;
import com.example.hyperstyle.dto.response.bill.BillResponse;
import com.example.hyperstyle.dto.response.bill.BillReturnedResponse;
import com.example.hyperstyle.dto.response.bill.FindBillByStatusRespose;
import com.example.hyperstyle.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface BillRepository extends JpaRepository<Bill, String> {

    @Query(value = """
               SELECT 
                    ROW_NUMBER() OVER(ORDER BY bi.last_modified_date DESC) AS stt, 
                    bi.id AS id, 
                    bi.code AS code, 
                    bi.created_date AS createdDate, 
                    bi.user_name AS userName, 
                    usem.full_name AS nameEmployees, 
                    bi.type AS type, 
                    bi.status_bill AS statusBill,
                    bi.last_modified_date AS lastModifiedDate,
                    bi.note AS note,
                    bi.phone_number AS phoneNumber,
                    CASE
                        WHEN (
                            COALESCE(bi.total_money, 0)
                          + COALESCE(bi.money_ship, 0)
                          - COALESCE(bi.item_discount, 0)
                        ) < 0 THEN 0
                        ELSE (
                            COALESCE(bi.total_money, 0)
                          + COALESCE(bi.money_ship, 0)
                          - COALESCE(bi.item_discount, 0)
                        )
                    END AS totalMoney,
                    bi.item_discount AS itemDiscount
               FROM bill bi
               LEFT JOIN account em ON em.id = bi.id_employees
               LEFT JOIN user usem ON usem.id = em.id_user
               WHERE 
                     (:#{#request.startDate} IS NULL OR bi.created_date >= :#{#request.startDate})
                 AND (:#{#request.endDate} IS NULL OR bi.created_date <= :#{#request.endDate})
                 
                 AND (:#{#request.startDeliveryDate} IS NULL OR bi.shipping_date >= :#{#request.startDeliveryDate})
                 AND (:#{#request.endDeliveryDate} IS NULL OR bi.shipping_date <= :#{#request.endDeliveryDate})
                 
                 /* --- DÒNG ĐÃ SỬA Ở ĐÂY --- */
                 /* Dùng converStatus để check null, dùng status cho mệnh đề IN */
                 AND (:#{#request.converStatus} IS NULL OR bi.status_bill IN (:#{#request.status}))
                 /* ------------------------- */
                 
                 AND (:#{#request.key} IS NULL OR :#{#request.key} = '' 
                      OR bi.code LIKE CONCAT('%', :#{#request.key}, '%') 
                      OR bi.user_name LIKE CONCAT('%', :#{#request.key}, '%') 
                      OR usem.full_name LIKE CONCAT('%', :#{#request.key}, '%') 
                      OR bi.phone_number LIKE CONCAT('%', :#{#request.key}, '%'))
                 
                 AND (:#{#request.type} IS NULL OR :#{#request.type} = '' OR bi.type = :#{#request.type})
                 
                 AND (:roles = 'ROLE_ADMIN' OR bi.id_employees = :id)
                 
               ORDER BY bi.last_modified_date DESC
            """, nativeQuery = true)
    List<BillResponse> getAll(@Param("id") String id, @Param("roles") String roles, @Param("request") BillRequest request);

    @Query(value = """
            SELECT b.status_bill AS status_bill, COUNT(b.id) AS quantity 
            FROM bill b 
            GROUP BY b.status_bill
            """, nativeQuery = true)
    List<FindBillByStatusRespose> countBillByStatus();

    @Query(value = """
            SELECT
                ROW_NUMBER() OVER (ORDER BY detail.last_modified_date DESC) AS stt,
                bd.id AS idBillDetail,
                detail.id AS idProductDetail,
                
                i.url AS image,
                
                CONCAT(p.name ,'[ ',s2.name,' - ',c2.name,' ]') AS nameProduct,
                bd.quantity AS quantity,
                bd.price AS price,
                c2.code AS codeColor,
                bd.status_bill AS statusBillDetail,
                bi.money_ship AS moneyShip 
            FROM bill bi
            JOIN bill_detail bd ON bi.id = bd.id_bill
            JOIN product_detail detail ON bd.id_product_detail = detail.id
            JOIN product p ON detail.id_product = p.id
            LEFT JOIN (
                SELECT id_product, MAX(id) AS max_image_id
                FROM image
                GROUP BY id_product
            ) max_images ON p.id = max_images.id_product
                    
            LEFT JOIN image i ON max_images.max_image_id = i.id
                    
            JOIN size s2 on detail.id_size = s2.id
            JOIN color c2 on detail.id_color = c2.id
            WHERE bi.id = :idBill AND bd.quantity > 0
            """, nativeQuery = true)
    List<BillReturnedResponse> getBillReturned(@Param("idBill") String idBill);

}
