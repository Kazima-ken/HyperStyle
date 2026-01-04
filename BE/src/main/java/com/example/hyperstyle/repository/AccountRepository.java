package com.example.hyperstyle.repository;

import com.example.hyperstyle.dto.response.account.AccountResponse;
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

//    @Query("select account from Account account where account.email=:email")
//    Optional<Account> getByEmail(String email);

    @Query(value = """
             SELECT ac.id, us.full_name FROM account ac
                        LEFT JOIN user us ON us.id = ac.id_user
                        WHERE roles IN (0,2)
            """, nativeQuery = true)
    List<StaffReduceResponse> getAllStaff();

    @Query(value = "SELECT ac.id, us.full_name AS fullName, us.phone_number AS phoneNumber,  us.email AS email, us.points" +
            " FROM account ac\n" +
            "LEFT JOIN user us ON us.id = ac.id_user\n" +
            "LEFT JOIN bill bi ON bi.id_account = ac.id\n" +
            "WHERE bi.id  = :idBill", nativeQuery = true)
    AccountResponse getAccountByIdBill(@Param("idBill") String idBill );

    @Query("select case when count(Account) >0 then true else false end from Account account where account.email =:email")
    boolean existsAccountByEmail(@Param("email") String email);

    @Query("SELECT ac from Account  ac where ac.id =: id")
    Account getOneById(@Param("id") String id);

    List<Account> getByRoles(Roles roles);

    Optional<Account> getByUser_Id(String userId);

}
