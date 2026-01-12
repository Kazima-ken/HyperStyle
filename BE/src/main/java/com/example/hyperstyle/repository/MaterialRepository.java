package com.example.hyperstyle.repository;

import com.example.hyperstyle.dto.request.material.GetMaterialRequest;
import com.example.hyperstyle.dto.response.material.MaterialResponse;
import com.example.hyperstyle.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialRepository extends JpaRepository<Material, String> {

    @Query(value = """
            select 
            ROW_NUMBER() OVER (ORDER BY mate.id DESC) as stt,
            mate.id as id,
            mate.name as name,
            mate.status as status,
            mate.created_by as createdBy
            from material mate
                where
                    (:name is null or :name = '' or mate.name like concat(:name, '%'))
                and
                    (:status is null or mate.status = :status)
            """, nativeQuery = true)
    List<MaterialResponse> getAll(
            @Param("name") String name,
            @Param("status") String status
    );


    Material findByName(String name);

}
