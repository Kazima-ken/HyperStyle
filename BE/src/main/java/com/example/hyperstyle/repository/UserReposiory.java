package com.example.hyperstyle.repository;

import com.example.hyperstyle.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserReposiory extends JpaRepository<User, String> {



}


