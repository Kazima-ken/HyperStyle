package com.example.hyperstyle.entity;

import com.example.hyperstyle.infrastructure.lister.CreateEntityLister;
import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

// BaseEntity implements IsIdentified and Serializable for best practice
@MappedSuperclass
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(CreateEntityLister.class)
public class BaseEntity implements Isdentityfied, Serializable {

    // Thêm serialVersionUID khi implement Serializable
    private static final long serialVersionUID = 1L;

    public static final byte LENGTH_ID = 36;

    @Id
    @Column(length = LENGTH_ID, updatable = false)
    private String id;
}