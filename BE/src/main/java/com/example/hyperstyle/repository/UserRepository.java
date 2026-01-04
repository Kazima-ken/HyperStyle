package com.example.hyperstyle.repository;

import com.example.hyperstyle.dto.request.staff.FindStaffRequest;
import com.example.hyperstyle.dto.response.staff.StaffFullResponse;
import com.example.hyperstyle.dto.response.user.UserResponse;
import com.example.hyperstyle.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    @Query(value = """
            SELECT
                ROW_NUMBER() OVER (ORDER BY u.last_modified_date DESC ) AS stt,
                u.id AS id,
                u.gender AS gender,
                u.full_name AS fullName,
                u.date_of_birth AS dateOfBirth,
                u.avata AS avata,
                u.email AS email,
                u.phone_number AS phoneNumber,
                u.updated_by AS updatedBy,
                u.created_by AS createdBy,
                u.status AS status,
                u.last_modified_date AS lastModifiedDate,
                u.citizen_identity AS citizenIdentity,
                a.password AS passWord,
                a.id AS idAccount
            FROM user u
              JOIN account a ON u.id = a.id_user
            WHERE a.roles='ROLE_EMLOYEE'
             AND  
              ( :#{#req.fullName} IS NULL 
                    OR :#{#req.fullName} LIKE '' 
                    OR u.full_name LIKE %:#{#req.fullName}% ) 
                AND
                ( :#{#req.email} IS NULL 
                    OR :#{#req.email} LIKE '' 
                    OR u.email LIKE %:#{#req.email}% ) 
                AND
                 ( :#{#req.phoneNumber} IS NULL 
                    OR :#{#req.phoneNumber} LIKE '' 
                    OR u.phone_number LIKE %:#{#req.phoneNumber}% )
                 AND 
                  ( :#{#req.status} IS NULL 
                    OR :#{#req.status} LIKE '' 
                    OR u.status LIKE :#{#req.status} )
            GROUP BY u.id
            ORDER BY u.id  DESC  
            """, nativeQuery = true)
    List<StaffFullResponse> getAll(@Param("req") FindStaffRequest request);

}
