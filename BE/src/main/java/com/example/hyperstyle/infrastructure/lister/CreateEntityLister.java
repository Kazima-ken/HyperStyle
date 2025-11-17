package com.example.hyperstyle.infrastructure.lister;

import com.example.hyperstyle.entity.BaseEntity;
import jakarta.persistence.PrePersist;

import java.util.UUID;

public class CreateEntityLister {
    @PrePersist
    private void onPrePersist(BaseEntity entity) {
        entity.setId(UUID.randomUUID().toString());
    }
}

