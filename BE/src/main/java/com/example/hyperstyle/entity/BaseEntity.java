package com.example.hyperstyle.entity;

import com.example.hyperstyle.infrastructure.lister.CreateEntityLister;
import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@MappedSuperclass
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(CreateEntityLister.class)
public class BaseEntity implements Isdentityfied {
    public static final byte LENGTH_ID = 36;
    @Id
    @Column(length = LENGTH_ID, updatable = false)
    private String id;
}