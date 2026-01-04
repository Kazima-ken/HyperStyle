package com.example.hyperstyle.repository;

import com.example.hyperstyle.dto.request.sole.FindSoleRequest;
import com.example.hyperstyle.dto.response.sole.SoleResponse;
import com.example.hyperstyle.entity.Category;
import com.example.hyperstyle.entity.Sole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SoleRepository extends JpaRepository<Sole, String> {

    @Query(value = """
            select 
            ROW_NUMBER() OVER (ORDER BY sol.id DESC) as stt,
            sol.id as id,
            sol.name as name,
            sol.status as status,
            sol.created_by as createdBy
            from sole sol
                where
                (
                    :#{#request.name} is null
                    or :#{#request.name} = ''
                    or sol.name like concat(:#{#request.name}, '%')
                )
            and
                (
                    :#{#request.status} is null
                    or sol.status like :#{#request.status}
                )
            """, nativeQuery = true)
    List<SoleResponse> getAll(@Param("request") FindSoleRequest request);
    

    Sole findByName(String name);
    
}
