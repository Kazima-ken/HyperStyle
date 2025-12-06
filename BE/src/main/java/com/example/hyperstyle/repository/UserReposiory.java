package com.example.hyperstyle.repository;

import com.example.hyperstyle.dto.request.employee.FindEmployeeRequest;
import com.example.hyperstyle.dto.respon.EmployeeResponse;
import com.example.hyperstyle.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserReposiory extends JpaRepository<User, String> {

    @Query("SELECT CASE WHEN COUNT(user) > 0 THEN true ELSE false END FROM User user WHERE user.phoneNumber = :phoneNumber")
    boolean existsUserByPhone(@Param("phoneNumber") String phoneNumber);

    @Query("SELECT CASE WHEN COUNT(user) > 0 THEN true ELSE false END FROM User user WHERE user.email = :email")
    boolean existsUserByEmail(@Param("email") String email);

}


