package com.example.hyperstyle.dto.response.staff;

import com.example.hyperstyle.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

@Projection(types = {User.class})
public interface StaffReduceResponse {

    @Value("#{target.id}")
    String getId();

    @Value("#{target.full_name}")
    String getUserName();

}
