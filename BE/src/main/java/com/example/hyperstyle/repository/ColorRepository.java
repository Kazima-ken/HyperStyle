package com.example.hyperstyle.repository;

import com.example.hyperstyle.dto.request.color.GetColorRequest;
import com.example.hyperstyle.dto.response.color.ColorResponse;
import com.example.hyperstyle.entity.Color;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ColorRepository extends JpaRepository<Color, String> {

    @Query(value = """
            select
                ROW_NUMBER() OVER (ORDER BY col.code DESC) as stt,
                col.id as id,
                col.name as name,
                col.code as code,                
                col.status as status,
                col.created_by as createdBy
            from color col
            where
                (
                    :#{#request.name} is null
                    or :#{#request.name} = ''
                    or col.name like concat(:#{#request.name}, '%')
                )
            and
                (
                    :#{#request.status} is null
                    or col.status like :#{#request.status}
                )
            """, nativeQuery = true)
    List<ColorResponse> getAll(@Param("request") GetColorRequest request);


    Color findByName(String name);

    @Query(value = """
            select c from Color c where c.code =:code
            """)
    Color getOneByCode(@Param("code") String code);

    @Query("SELECT DISTINCT  c FROM  Color c ")
    List<Color> getAllCode();


    @Query(value = """
            select * from color c where c.name =:name and c.id =:id
            """, nativeQuery = true)
    Color findByNameExists(@Param("id") String id, @Param("name") String name);

    boolean existsByNameIgnoreCase(String name);

    boolean existsByCodeIgnoreCase(String code);

}
