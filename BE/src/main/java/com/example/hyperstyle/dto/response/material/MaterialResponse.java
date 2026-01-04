package com.example.hyperstyle.dto.response.material;

import com.example.hyperstyle.entity.Brand;
import com.example.hyperstyle.entity.Material;
import com.example.hyperstyle.infrastructure.constant.Status;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

@Projection(types = Material.class)
public interface MaterialResponse {

    @Value("#{target.id}")
    String getId();

    @Value("#{target.name}")
    String getName();

    @Value("#{target.status}")
    Status getStatus();

    @Value("#{target.createdBy}")
    String getCreatedBy();

}

