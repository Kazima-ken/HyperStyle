package com.example.hyperstyle.repository;

import com.example.hyperstyle.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImageRepository extends JpaRepository<Image, String> {

    // Hàm này bạn KHÔNG dùng, có thể xóa hoặc để đó, nhưng coi chừng lỗi mapping cột
    @Query(value = """
            select 
                i.id as id,
                i.url as url,
                i.status as status
            from product pro
            join image i on pro.id =i.id_product
            """, nativeQuery = true)
    List<Image> findAllByProduct(@Param("id") String id);


    // Hàm này bạn ĐANG dùng.
    // Hãy chắc chắn trong Database bảng 'image' có cột tên là 'id_product'
    @Query(value = "SELECT * FROM image WHERE id_product = :id", nativeQuery = true)
    List<Image> getAllByProduct(@Param("id") String id);

}
