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
                MIN(pd.price) as price,
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

}

