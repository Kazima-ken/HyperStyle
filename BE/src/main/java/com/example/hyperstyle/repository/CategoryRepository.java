package com.example.hyperstyle.repository;

import com.example.hyperstyle.dto.request.category.GetCategoryRequest;
import com.example.hyperstyle.dto.response.category.CategoryResponse;
import com.example.hyperstyle.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {

    @Query(value = """
            select 
            ROW_NUMBER() OVER (ORDER BY cate.id DESC) as stt,
            cate.id as id,
            cate.name as name,
            cate.status as status,
            cate.created_by as createdBy
            from category cate
                where
                (
                    :#{#request.name} is null
                    or :#{#request.name} = ''
                    or cate.name like concat(:#{#request.name}, '%')
                )
            and
                (
                    :#{#request.status} is null
                    or cate.status like :#{#request.status}
                )
            """, nativeQuery = true)
    List<CategoryResponse> getAll(@Param("request") GetCategoryRequest request);

    @Query("""
                SELECT cate FROM Category cate 
                WHERE cate.id = :id AND cate.name = :name
            """)
    Category findOneByNameAndId(@Param("name") String name, @Param("id") Long id);

    Category findByName(String name);

}
