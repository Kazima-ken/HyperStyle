package com.example.hyperstyle.repository;

import com.example.hyperstyle.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, String> {

//    @Query("select account from Account account where account.email =:email")
//    Account getOneByEmail(@Param("email") String email);
//    Optional<Account> getByEmail(String email);

    @Query("select account from Account account where account.email=:email")
    Optional<Account> findByEmail(String email);

//    @Query("select account from Account account where account.password =:password")
//    Account getOneByPassword(@Param("password") String password);
//    Optional<Account> getByPassword(String password);

//    @Query("select account from Account account where account.password=:password")
//    Optional<Account> findByPassword(String password);

}
