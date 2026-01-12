package com.example.hyperstyle.repository;

import com.example.hyperstyle.dto.request.staff.FindStaffRequest;
import com.example.hyperstyle.dto.response.account.AccountResponse;
import com.example.hyperstyle.dto.response.staff.StaffFullResponse;
import com.example.hyperstyle.dto.response.staff.StaffReduceResponse;
import com.example.hyperstyle.entity.Account;
import com.example.hyperstyle.infrastructure.constant.Roles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, String> {

    @Query("SELECT account FROM Account account WHERE account.email =:email")
    Account getOneByEmail(@Param("email") String email);

    Optional<Account> getByEmail(String email);


    @Query(value = """
            SELECT
                ROW_NUMBER() OVER (ORDER BY u.id DESC) AS stt,
                u.id AS id,
                u.full_name AS fullName,
                u.email AS email,
                u.avata AS avata,
                u.phone_number AS phoneNumber,
                u.status AS status,
                u.date_of_birth AS dateOfBirth,
                a.password AS password,
                u.gender AS gender,
                a.id AS idAccount,
                u.citizen_identity AS citizenIdentity
            FROM user u
            JOIN account a ON u.id = a.id_user
            WHERE a.roles LIKE '%ROLE_EMLOYEE%'
            """, nativeQuery = true)
    List<StaffFullResponse> getAllStaff();

    @Query(value = "SELECT ac.id, us.full_name AS fullName, us.phone_number AS phoneNumber,  us.email AS email" +
            " FROM account ac\n" +
            "LEFT JOIN user us ON us.id = ac.id_user\n" +
            "LEFT JOIN bill bi ON bi.id_account = ac.id\n" +
            "WHERE bi.id  = :idBill", nativeQuery = true)
    AccountResponse getAccountByIdBill(@Param("idBill") String idBill);

    @Query("select case when count(Account) >0 then true else false end from Account account where account.email =:email")
    boolean existsAccountByEmail(@Param("email") String email);

    @Query("SELECT ac from Account  ac where ac.id =: id")
    Account getOneById(@Param("id") String id);

    List<Account> getByRoles(Roles roles);

    Optional<Account> getByUser_Id(String userId);

    @Query(value = """
            SELECT a FROM Account a WHERE a.email = :email
            """)
    Optional<Account> findByEmail(String email);

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

    @Query("SELECT a FROM Account a WHERE a.user.id = :userId")
    Optional<Account> findByUserId(@Param("userId") String userId);

    boolean existsByEmail(String email);

}
