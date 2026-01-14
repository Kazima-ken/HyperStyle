package com.example.hyperstyle.repository;

import com.example.hyperstyle.dto.response.CartResponse;
import com.example.hyperstyle.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, String> {

    Optional<Cart> findByAccount_IdAndProductDetail_Id(String idAccount, String idProductDetail);

    @Query(value = """
                SELECT
                    c.id AS idCart,
                    pd.id AS idProductDetail,
                    p.id AS idProduct,
                    p.name AS nameProduct,
                    s.name AS nameSize,
                    cl.code AS codeColor,
                    img.url AS image,
                    pd.price AS price,
                    c.quantity AS quantity,
                    pd.quantity AS quantityProductDetail
                FROM cart c
                JOIN product_detail pd ON c.id_product_detail = pd.id
                JOIN product p ON pd.id_product = p.id
                JOIN size s ON pd.id_size = s.id
                JOIN color cl ON pd.id_color = cl.id
                LEFT JOIN image img ON img.id_product = p.id AND img.status = true
                WHERE c.id_account = :idAccount
                GROUP BY c.id, pd.id, p.id, s.id, cl.id, img.url, pd.price, c.quantity, pd.quantity
            """, nativeQuery = true)
    List<CartResponse> getListCart(@Param("idAccount") String idAccount);


    @Query("""
                select coalesce(sum(c.quantity), 0)
                from Cart c
                where c.account.id = :idAccount
                  and c.status = 'DANG_SU_DUNG'
            """)
    Integer quantityInCart(@Param("idAccount") String idAccount);

    List<Cart> findAllByAccount_Id(String idAccount);


}
