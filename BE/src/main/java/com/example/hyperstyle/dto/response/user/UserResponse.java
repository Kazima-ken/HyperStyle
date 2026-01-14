package com.example.hyperstyle.dto.response.user;

import com.example.hyperstyle.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.util.Date;

@Projection(types = User.class)
public interface UserResponse {

    @Value("#{target.stt}")
    Integer getSTT();

    @Value("#{target.id}")
    String getId();

    @Value("#{target.email}")
    String getEmail();

    @Value("#{target.avata}")
    String getAvata();

    @Value("#{target.phoneNumber}")
    String getPhoneNumber();

    @Value("#{target.status}")
    String getStatus();

    @Value("#{target.dateOfBirth}")
    Date getDateOfBirth();

    @Value("#{target.fullName}")
    String getFullName();

    @Value("#{target.password}")
    String getPassword();

    @Value("#{target.gender}")
    Boolean getGender();

    @Value("#{target.idAccount}")
    String getIdAccount();

    @Value("#{target.citizenIdentity}")
    String getCitizenIdentity();

}
