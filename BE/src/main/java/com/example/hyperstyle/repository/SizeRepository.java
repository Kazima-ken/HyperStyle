package com.example.hyperstyle.repository;

import com.example.hyperstyle.dto.request.size.FindSizeRequest;
import com.example.hyperstyle.dto.response.size.SizeResponse;
import com.example.hyperstyle.entity.Category;
import com.example.hyperstyle.entity.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SizeRepository extends JpaRepository<Size, String> {

    @Query(value = """
            select 
            ROW_NUMBER() OVER (ORDER BY siz.id DESC) as stt,
            siz.id as id,
            siz.name as name,
            siz.status as status,
            siz.created_by as createdBy
            from size siz
                where
                (
                    :#{#request.name} is null
                    or :#{#request.name} = ''
                    or siz.name like concat(:#{#request.name}, '%')
                )
            and
                (
                    :#{#request.status} is null
                    or siz.status like :#{#request.status}
                )
            """, nativeQuery = true)
    List<SizeResponse> getAll(@Param("request") FindSizeRequest request);


    Size findByName(String name);

    
}
