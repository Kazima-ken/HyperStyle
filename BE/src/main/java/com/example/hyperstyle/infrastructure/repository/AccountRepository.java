package com.example.hyperstyle.infrastructure.repository;
import com.example.hyperstyle.entity.Account;
import com.example.hyperstyle.infrastructure.constant.Role; // Dùng package mới
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, String> {
    List<Account> findByRole(Role role);

    Optional<Account> findByUser_Id(String userId);
    Optional<Account> findByEmail(String email);
}
