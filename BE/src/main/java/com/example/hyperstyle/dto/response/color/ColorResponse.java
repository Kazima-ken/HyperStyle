package com.example.hyperstyle.dto.response.color;

import com.example.hyperstyle.entity.Color;
import com.example.hyperstyle.infrastructure.constant.Status;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

@Projection(types = Color.class)
public interface ColorResponse {

    @Value("#{target.id}")
    String getId();

    @Value("#{target.name}")
    String getName();

    @Value("#{target.code}")
    String getCode();

    @Value("#{target.status}")
    Status getStatus();

    @Value("#{target.createdBy}")
    String getCreatedBy();

}
