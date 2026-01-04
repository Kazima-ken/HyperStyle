package com.example.hyperstyle.dto.response.account;

import com.example.hyperstyle.entity.Account;
import com.example.hyperstyle.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.util.UUID;

@Projection(types = {Account.class, User.class})
public interface AccountResponse {

    @Value("#{target.id}")
    UUID getId();

    @Value("#{target.fullName}")
    String getFullName();

    @Value("#{target.phoneNumber}")
    String getPhoneNumber();

    @Value("#{target.email}")
    String getEmail();

    @Value("#{target.points}")
    int getPoints();

}
