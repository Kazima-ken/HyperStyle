package com.example.hyperstyle.repository;

import com.example.hyperstyle.dto.request.product.GetProductRequest;
import com.example.hyperstyle.dto.request.productDetail.GetProductDetailRequest;
import com.example.hyperstyle.dto.response.product.ProductResponse;
import com.example.hyperstyle.dto.response.productdetail.ProductDetailResponse;
import com.example.hyperstyle.entity.Product; // Đảm bảo Entity Product đã tồn tại
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {

    @Query(value = """
            SELECT
                ROW_NUMBER() OVER (ORDER BY GREATEST(p.last_modified_date, MAX(pd.last_modified_date)) DESC) AS stt,
                p.id AS id,
                p.name AS nameProduct,
                p.code AS code,                
                p.status AS status,
                b.name AS nameBrand,    
                c.name AS nameCategory,  
                s.name AS nameSole,       
                m.name AS nameMaterial,  
                (SELECT i.url FROM image i WHERE i.id_product = p.id AND i.status = true LIMIT 1) AS image,
                SUM(pd.quantity) AS totalQuantity
                
            FROM product p
            LEFT JOIN product_detail pd ON p.id = pd.id_product
                    
            LEFT JOIN brand b ON p.id_brand = b.id       
            LEFT JOIN category c ON p.id_category = c.id 
            LEFT JOIN sole s ON p.id_sole = s.id
            LEFT JOIN material m ON p.id_material = m.id 
            WHERE (:#{#request.keyword} IS NULL OR :#{#request.keyword} = ''
                  OR p.code LIKE CONCAT('%', :#{#request.keyword}, '%') 
                  OR p.name LIKE CONCAT('%', :#{#request.keyword} , '%'))
            AND (:#{#request.status} IS NULL OR :#{#request.status} = '' OR p.status = :#{#request.status})
            GROUP BY p.id, p.name, p.code, p.status, p.last_modified_date, 
                     b.name, c.name, s.name, m.name
            HAVING (:#{#request.minQuantity} IS NULL OR SUM(pd.quantity) >= :#{#request.minQuantity})
            AND (:#{#request.maxQuantity} IS NULL OR SUM(pd.quantity) <= :#{#request.maxQuantity})
                    
            ORDER BY GREATEST(p.last_modified_date, MAX(pd.last_modified_date)) DESC
            """, nativeQuery = true)
    List<ProductResponse> getAll(@Param("request") GetProductRequest request);


    @Query("SELECT p FROM Product p WHERE p.code = :code")
    Product getOneByCode(@Param("code") String code);

    boolean existsByCode(String code);

    boolean existsByName(String name);

    @Query("SELECT p FROM Product p WHERE p.name = :name")
    Product getOneByName(@Param("name") String name);

    @Query(value = "SELECT p.name FROM product p WHERE (:name IS NULL OR :name = '' OR p.name LIKE CONCAT('%', :name, '%'))", nativeQuery = true)
    List<String> getAllByName(@Param("name") String name);


    @Query(value = """
            SELECT
               ROW_NUMBER() OVER (ORDER BY detail.last_modified_date DESC) AS stt,
               detail.id AS id,
               i.name AS image,
               CONCAT(p.name, ' [ ', s2.name, ' - ', c2.name, ' ]') AS nameProduct,
               detail.price AS price,
               detail.created_date AS createdDate,
               detail.gender AS gender,
               detail.status AS status,
               si.name AS nameSize,
               c.name AS nameCategory,
               b.name AS nameBrand,
               detail.quantity AS quanity,
               (SELECT MAX(pr.value)
                   FROM promotion_product_detail ppd
                   JOIN promotion pr ON ppd.id_promotion = pr.id
                   WHERE ppd.id_product_detail = detail.id 
                   AND ppd.status = 'DANG_SU_DUNG' 
                   AND pr.status = 'DANG_KICH_HOAT') AS promotion,
               s2.name AS size,
               c2.code AS color,
               detail.maqr AS QRCode
            FROM product_detail detail
            JOIN product p ON detail.id_product = p.id
            -- Lấy các thuộc tính từ bảng Product theo Schema của bạn
            JOIN category c ON p.id_category = c.id
            JOIN brand b ON p.id_brand = b.id
            JOIN material m ON p.id_material = m.id
            JOIN sole s ON p.id_sole = s.id
            -- Lấy các thuộc tính biến thể từ ProductDetail
            JOIN size s2 ON detail.id_size = s2.id
            JOIN color c2 ON detail.id_color = c2.id
            LEFT JOIN size si ON detail.id_size = si.id
            -- Lấy ảnh đại diện (giả sử có bảng image)
            LEFT JOIN (
                SELECT id_product_detail, MAX(name) AS name 
                FROM image GROUP BY id_product_detail
            ) i ON detail.id = i.id_product_detail
            WHERE (:#{#request.product} IS NULL OR :#{#request.product} = '' 
                   OR p.name LIKE CONCAT('%', :#{#request.product}, '%'))
            AND (:#{#request.brand} IS NULL OR :#{#request.brand} = '' 
                   OR b.name LIKE CONCAT('%', :#{#request.brand}, '%'))
            AND (:#{#request.status} IS NULL OR :#{#request.status} = '' 
                   OR detail.status = :#{#request.status})
            AND (:#{#request.gender} IS NULL OR :#{#request.gender} = '' 
                   OR detail.gender = :#{#request.gender})
            AND (:#{#request.minPrice} IS NULL OR detail.price >= :#{#request.minPrice}) 
            AND (:#{#request.maxPrice} IS NULL OR detail.price <= :#{#request.maxPrice})
            GROUP BY 
                detail.id, i.name, p.name, s2.name, c2.name, detail.price, 
                detail.created_date, detail.gender, detail.status, si.name, 
                c.name, b.name, detail.quantity, c2.code, detail.maqr, detail.last_modified_date
            ORDER BY detail.last_modified_date DESC 
            """, nativeQuery = true)
    List<ProductDetailResponse> getAllProduct(@Param("request") GetProductDetailRequest request);
}

