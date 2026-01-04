package com.example.hyperstyle.repository;

import com.example.hyperstyle.dto.request.address.FindAddressRequest;
import com.example.hyperstyle.dto.response.address.AddressResponse;
import com.example.hyperstyle.dto.response.address.AddressUserReponse;
import com.example.hyperstyle.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, String> {

    @Query(value = """
            SELECT 
                ROW_NUMBER() OVER (ORDER BY a.last_modified_date DESC ) AS stt,
                a.id AS id,
                CONCAT(a.line, ', ', a.district,', ', a.ward,', ', a.province ) AS address,
                a.line AS line,
                a.district AS district,
                a.province AS province,
                a.ward AS ward,
                a.status AS status,
                a.province_id AS provinceId,
                a.to_district_id AS toDistrictId,
                a.ward_code AS wardCode,
                a.full_name AS fullName,
                a.phone_number AS phoneNumber,
                u.id AS userId
            FROM address a
            JOIN user u on a.id_user = u.id
            WHERE u.id LIKE :#{#idUser}
            GROUP BY a.id
            ORDER BY a.status ASC
                  """,
            nativeQuery = true
    )
    List<AddressUserReponse> findAddressByUserId(@Param("idUser") String idUser);

    @Query(value = """
            SELECT 
                ROW_NUMBER() OVER (ORDER BY a.last_modified_date DESC ) AS stt,
                a.id AS id,
                a.line AS line,
                a.district AS district,
                a.province AS province,
                a.ward AS ward,
                a.status AS status,
                u.id AS idUser
            FROM address a
            JOIN user u on a.id_user = u.id
            WHERE u.status = 'DANG_SU_DUNG'
              AND 
                  ( u.id LIKE %:#{#req.id_user}% )
            AND 
                  ( :#{#req.line} IS NULL 
                      OR :#{#req.line} LIKE '' 
                      OR a.line LIKE %:#{#req.line}% )
            AND 
                  ( :#{#req.district} IS NULL 
                      OR :#{#req.district} LIKE '' 
                      OR a.district LIKE %:#{#req.district}% )
            AND 
                  ( :#{#req.province} IS NULL 
                      OR :#{#req.province} LIKE '' 
                      OR a.province LIKE %:#{#req.province}% )
            AND 
                  ( :#{#req.ward} IS NULL 
                      OR :#{#req.ward} LIKE '' 
                      OR a.ward LIKE %:#{#req.ward}% )  
            AND 
                 ( :#{#req.status} IS NULL 
                    OR :#{#req.status} LIKE '' 
                    OR a.status LIKE :#{#req.status} )      
            GROUP BY a.id
            ORDER BY a.last_modified_date DESC
                  """,
            nativeQuery = true
    )
    List<AddressResponse> getAll(@Param("req") FindAddressRequest req);

}
