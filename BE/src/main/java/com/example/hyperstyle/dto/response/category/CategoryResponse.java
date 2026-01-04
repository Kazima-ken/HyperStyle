package com.example.hyperstyle.dto.response.category;

import com.example.hyperstyle.entity.Category;
import com.example.hyperstyle.infrastructure.constant.Status;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

@Projection(types = Category.class)
public interface CategoryResponse {

    @Value("#{target.id}")
    String getId();

    @Value("#{target.name}")
    String getName();

    @Value("#{target.status}")
    Status getStatus();

    @Value("#{target.createdBy}")
    String getCreatedBy();

}
