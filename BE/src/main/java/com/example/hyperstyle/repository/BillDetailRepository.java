package com.example.hyperstyle.repository;

import com.example.hyperstyle.dto.request.bill.BillDetailRequest;
import com.example.hyperstyle.dto.response.BillDetailResponse;
import com.example.hyperstyle.entity.BillDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BillDetailRepository extends JpaRepository<BillDetail, String> {

    @Query(value = """
            SELECT 
                ROW_NUMBER() OVER( ORDER BY bide.created_date ASC ) AS stt,
                bi.id AS idBill,       
                im.url AS image, 
                bide.id AS id, 
                prde.id AS idProduct,        
                pr.code AS codeProduct,   
                pr.name AS productName,     
                co.name AS nameColor,          
                si.name AS nameSize,          
                co.code AS codeColor,          
                so.name AS nameSole,         
                ma.name AS nameMaterial,
                ca.name AS nameCategory,
                bide.price AS price,
                bide.quantity AS quantity, 
                prde.quantity AS maxQuantity,
                bide.status_bill AS status 
            FROM bill_detail bide 
            LEFT JOIN bill bi ON bide.id_bill = bi.id
            LEFT JOIN product_detail prde ON bide.id_product_detail = prde.id
            LEFT JOIN product pr ON pr.id = prde.id_product
            LEFT JOIN (
                 SELECT id_product, MAX(id) AS max_image_id
                 FROM image
                 GROUP BY id_product
            ) max_images ON pr.id = max_images.id_product
            LEFT JOIN image im ON max_images.max_image_id = im.id
            LEFT JOIN color co ON co.id = prde.id_color
            LEFT JOIN size si ON si.id = prde.id_size
            LEFT JOIN sole so ON so.id = pr.id_sole
            LEFT JOIN material ma ON ma.id = pr.id_material
            LEFT JOIN category ca ON ca.id = pr.id_category
            WHERE bi.id = :#{#request.idBill} 
              AND ( 
                    :#{#request.status} IS NULL 
                    OR :#{#request.status} = '' 
                    OR CAST(bide.status_bill AS CHAR(50)) = :#{#request.status} 
              )
            """, nativeQuery = true)
    List<BillDetailResponse> findAllByIdBill(@Param("request") BillDetailRequest request);
}
