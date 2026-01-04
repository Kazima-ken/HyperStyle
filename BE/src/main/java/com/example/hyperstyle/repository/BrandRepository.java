package com.example.hyperstyle.repository;

import com.example.hyperstyle.dto.request.brand.GetBrandRequest;
import com.example.hyperstyle.dto.response.brand.BrandResponse;
import com.example.hyperstyle.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BrandRepository extends JpaRepository<Brand, String> {

    @Query(value = """
            select
                ROW_NUMBER() OVER (ORDER BY brand.id DESC) as stt,
                brand.id as id,
                brand.name as name,
                brand.status as status,
                brand.created_by as createdBy
            from brand brand
            where
                (
                    :#{#request.name} is null
                    or :#{#request.name} = ''
                    or brand.name like concat(:#{#request.name}, '%')
                )
            and
                (
                    :#{#request.status} is null
                    or brand.status like :#{#request.status}
                )
            """, nativeQuery = true)
    List<BrandResponse> getAll(@Param("request") GetBrandRequest request);


    Brand getByName(String name);

    @Query(value = """
            select * from brand b where b.name =:name and b.id =:id
            """, nativeQuery = true)
    Brand findByNameExists(@Param("id") String id, @Param("name") String name);

}
