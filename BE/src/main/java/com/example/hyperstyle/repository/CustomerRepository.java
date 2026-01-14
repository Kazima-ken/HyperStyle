package com.example.hyperstyle.repository;

import com.example.hyperstyle.entity.Account;
import com.example.hyperstyle.infrastructure.constant.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Account, String> {

    @Query("SELECT a FROM Account a " +
            "LEFT JOIN FETCH a.user u " +
            "WHERE a.roles = 'ROLE_USER' " +
            "AND (:keyword IS NULL OR :keyword = '' OR lower(u.fullName) LIKE lower(concat('%', :keyword, '%')) OR u.phoneNumber LIKE concat('%', :keyword, '%')) " +
            "AND (:status IS NULL OR a.status = :status)")
    List<Account> findAllCustomers(@Param("keyword") String keyword, @Param("status") Status status);
}
