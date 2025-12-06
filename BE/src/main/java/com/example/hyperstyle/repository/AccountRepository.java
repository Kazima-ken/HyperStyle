package com.example.hyperstyle.repository;

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

    @Query("select account from Account account where account.email=:email")
    Optional<Account> findByEmail(String email);

    @Query("select case when count(Account) >0 then true else false end from Account account where account.email =:email")
    boolean existsAccountByEmail(@Param("email")String email);

    @Query("SELECT ac from Account  ac where ac.id =: id")
    Account getOneById(@Param("id") String id);

    List<Account> findByRoles(Roles roles);

    Optional<Account> findByUser_Id(String userId);

}
