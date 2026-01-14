package com.example.hyperstyle.repository;

import com.example.hyperstyle.dto.request.productDetail.GetProductDetailRequest;
import com.example.hyperstyle.dto.response.productdetail.GetByProduct;
import com.example.hyperstyle.dto.response.productdetail.GetByProductDetail;
import com.example.hyperstyle.dto.response.productdetail.ProductDetailResponse;
import com.example.hyperstyle.entity.ProductDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductDetailRepository extends JpaRepository<ProductDetail, String> {


    @Query(value = """
                SELECT
                   ROW_NUMBER() OVER (ORDER BY detail.last_modified_date DESC) AS stt,
                   detail.id AS id,
                   ima.url AS image,
                   
                   CONCAT(prod.name ,' [ ', siz.name, ' - ', col.name, ' ]') AS nameProduct,
                   detail.price AS price,
                   detail.created_date AS createdDate,
                   detail.gender AS gender,
                   detail.status AS status,
                   siz.name AS nameSize, 
                   cate.name AS nameCategory,
                   bra.name AS nameBrand,
                   detail.quantity AS quantity,
                   
                   siz.name AS size,
                   col.code AS color
                    
                FROM product_detail detail
                JOIN product prod ON detail.id_product = prod.id
                
                JOIN brand bra ON prod.id_brand = bra.id
                JOIN material mate ON prod.id_material = mate.id
                JOIN category cate ON prod.id_category = cate.id
                JOIN sole sol ON prod.id_sole = sol.id
                
                
                JOIN size siz on detail.id_size = siz.id
                JOIN color col on detail.id_color = col.id
                
                LEFT JOIN (
                    SELECT id_product, MAX(id) AS max_image_id
                    FROM image
                    WHERE status = true 
                    GROUP BY id_product
                ) max_images ON prod.id = max_images.id_product
                LEFT JOIN image ima ON max_images.max_image_id = ima.id
                
                WHERE 
                    prod.id = COALESCE(NULLIF(:#{#request.idProduct}, ''), prod.id)
                AND ( :#{#request.size} = 0 OR siz.name = :#{#request.size} OR :#{#request.size} = '' )
                AND ( :#{#request.color} IS NULL OR :#{#request.color} = '' OR col.code LIKE CONCAT('%', :#{#request.color}, '%') )
                
                AND ( :#{#request.brand} IS NULL OR :#{#request.brand} = '' OR bra.name LIKE CONCAT('%', :#{#request.brand}, '%') )
                AND ( :#{#request.material} IS NULL OR :#{#request.material} = '' OR mate.name LIKE CONCAT('%', :#{#request.material}, '%') ) 
                AND ( :#{#request.product} IS NULL OR :#{#request.product} = ''  OR prod.name LIKE CONCAT('%', :#{#request.product}, '%') ) 
                AND ( :#{#request.sole} IS NULL  OR :#{#request.sole} = '' OR sol.name LIKE CONCAT('%', :#{#request.sole}, '%') )
                AND ( :#{#request.category} IS NULL OR :#{#request.category} = '' OR cate.name LIKE CONCAT('%', :#{#request.category}, '%') )
                
                AND ( :#{#request.status} IS NULL   OR :#{#request.status} = '' OR detail.status = :#{#request.status} )
                AND ( :#{#request.gender} IS NULL OR :#{#request.gender} = '' OR detail.gender = :#{#request.gender} )
                AND ( :#{#request.minPrice} IS NULL OR detail.price >= :#{#request.minPrice} ) 
                AND ( :#{#request.maxPrice} IS NULL OR detail.price <= :#{#request.maxPrice} )

                GROUP BY 
                    detail.id, ima.url, prod.name, siz.name, col.name, detail.price, 
                    detail.created_date, detail.gender, detail.status,
                    cate.name, bra.name, detail.quantity, col.code, detail.last_modified_date
                    
                ORDER BY detail.last_modified_date DESC 
            """, nativeQuery = true)
    List<ProductDetailResponse> getAll(@Param("request") GetProductDetailRequest request);

    @Query(value = """
                SELECT
                    detail.id AS id,
                    prod.name AS nameProduct,
                    detail.description AS description,
                    detail.price AS price,
                    detail.quantity AS quantity,
                    detail.gender AS gender,
                    detail.status AS status,
                    detail.created_date AS created_date,
                    
                    prod.id_category AS idCategory,
                    prod.id_material AS idMaterial,
                    prod.id_sole AS idSole,
                    prod.id_brand AS idBrand,
                    detail.id_size AS idSize,
                    detail.id_color AS idColor,
                    
                    ima.url AS image
                           
                FROM product_detail detail
                JOIN product prod ON detail.id_product = prod.id
                
                LEFT JOIN size siz ON detail.id_size = siz.id
                LEFT JOIN color col ON detail.id_color = col.id
                

                LEFT JOIN (
                    SELECT id_product, MAX(id) AS max_image_id
                    FROM image
                    WHERE status = true
                    GROUP BY id_product
                ) max_images ON prod.id = max_images.id_product
                LEFT JOIN image ima ON max_images.max_image_id = ima.id
                
                WHERE
                    detail.id_product = :id
                
                GROUP BY 
                    detail.id, prod.name, detail.description, detail.price, detail.quantity, 
                    detail.gender, detail.status, detail.created_date,
                    prod.id_category, prod.id_material, prod.id_sole, prod.id_brand,
                    detail.id_size, detail.id_color, ima.url
            """, nativeQuery = true)
    List<GetByProduct> getByIdProduct(@Param("id") String id);

    @Query(value = """
                SELECT
                    detail.id AS id,
                    prod.name AS nameProduct,
                    detail.description AS description,
                    detail.price AS price,
                    detail.quantity AS quantity,
                    detail.gender AS gender,
                    detail.status AS status,
                    detail.created_date AS created_date,
                    
                    prod.id_category AS idCategory,
                    prod.id_material AS idMaterial,
                    prod.id_sole AS idSole,
                    prod.id_brand AS idBrand,
                    detail.id_size AS idSize,
                    detail.id_color AS idColor,
                    
                    ima.url AS image
                           
                FROM product_detail detail
                JOIN product prod ON detail.id_product = prod.id
                
                LEFT JOIN size siz ON detail.id_size = siz.id
                LEFT JOIN color col ON detail.id_color = col.id
                

                LEFT JOIN (
                    SELECT id_product, MAX(id) AS max_image_id
                    FROM image
                    WHERE status = true
                    GROUP BY id_product
                ) max_images ON prod.id = max_images.id_product
                LEFT JOIN image ima ON max_images.max_image_id = ima.id
                
                WHERE
                    detail.id = :id
                
                GROUP BY 
                    detail.id, prod.name, detail.description, detail.price, detail.quantity, 
                    detail.gender, detail.status, detail.created_date,
                    prod.id_category, prod.id_material, prod.id_sole, prod.id_brand,
                    detail.id_size, detail.id_color, ima.url
            """, nativeQuery = true)
    Optional<GetByProductDetail> getByIdProductDetail(@Param("id") String id);

    List<ProductDetail> findAllByProductId(String productId);

    boolean existsByProductIdAndSizeIdAndColorId(String productId, String sizeId, String colorId);

    boolean existsByProductIdAndSizeIdAndColorIdAndIdNot(String productId, String sizeId, String colorId, String id);



    @Query("SELECT pd FROM ProductDetail pd WHERE pd.product.id = :productId")
    List<ProductDetail> getAllByProductId(@Param("productId") String productId);

}