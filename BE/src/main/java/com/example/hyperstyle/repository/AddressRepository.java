package com.example.hyperstyle.repository;

import com.example.hyperstyle.dto.request.address.FindAddressRequest;
import com.example.hyperstyle.dto.response.address.AddressResponse;
import com.example.hyperstyle.dto.response.address.AddressUserReponse;
import com.example.hyperstyle.entity.Address;
import com.example.hyperstyle.infrastructure.constant.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, String> {

    @Query(value = """
            SELECT 
                ROW_NUMBER() OVER (ORDER BY a.id DESC ) AS stt,
                a.id AS id,
                CONCAT(a.line, ', ', a.district,', ', a.ward,', ', a.province ) AS address,
                a.line AS line,
                a.district AS district,
                a.province AS province,
                a.ward AS ward,
                a.status AS status,
                a.province_id AS provinceId,
                a.district_id AS DistrictId,
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
    List<AddressUserReponse> getAddressByUserId(@Param("idUser") String idUser);

    @Query(value = """
                SELECT 
                    ROW_NUMBER() OVER (ORDER BY a.id DESC) AS stt,
                    a.id AS id,
                    CONCAT(a.line, ', ', a.district, ', ', a.ward, ', ', a.province) AS address,
                    a.line AS line,
                    a.district AS district,
                    a.province AS province,
                    a.ward AS ward,
                    a.status AS status,
                    a.province_id AS provinceId,
                    a.district_id AS districtId,
                    a.ward_code AS wardCode,
                    a.full_name AS fullName,
                    a.phone_number AS phoneNumber,
                    u.id AS userId
                FROM address a
                JOIN user u ON a.id_user = u.id
                JOIN account acc ON acc.id_user = u.id
                WHERE acc.id = :accountId
                ORDER BY a.status ASC
            """, nativeQuery = true)
    List<AddressUserReponse> getAddressByAccountId(
            @Param("accountId") String accountId
    );


    @Query("""
                select a
                from Address a
                where a.user.id = :id
                  and a.status = :status
            """)
    Address getAddressByUserIdAndStatus(@Param("id") String id,
                                        @Param("status") Status status);

    @Query(value = """
                SELECT 
                    ROW_NUMBER() OVER (ORDER BY a.id DESC) AS stt,
                    a.id AS id,
                    a.line AS line,
                    a.district AS district,
                    a.province AS province,
                    a.ward AS ward,
                    a.status AS status,
                    a.full_name AS fullName,
                    a.phone_number AS phoneNumber,
                    u.id AS idUser,
                    a.district_id AS districtId,   -- THÊM TRƯỜNG NÀY
                    a.ward_code AS wardCode        -- THÊM TRƯỜNG NÀY
                FROM address a
                ...
            """, nativeQuery = true)
    List<AddressResponse> getAll(@Param("req") FindAddressRequest req);

    @Query("SELECT a FROM  Address a WHERE (a.status =:status) and (a.user.id =:idUser)")
    List<Address> getAllAddressByStatus(@Param("status") Status status, @Param("idUser") String idUser);

    @Query("SELECT a FROM Address a WHERE a.user.id = :userId")
    Optional<Address> findByUserId(@Param("userId") String userId);

    List<Address> findByUserIdAndStatus(@Param("idUser") String idUser, @Param("status") Status status);

    List<Address> findAllByUserId(String userId);

    List<Address> findAllByUserIdAndStatus(String userId, Status status);



}
