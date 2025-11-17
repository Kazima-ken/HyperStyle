package com.example.hyperstyle.entity;

import com.example.hyperstyle.infrastructure.constant.Status;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "brand")
public class Brand extends BaseEntity{

    @Column(name = "name")
    private String name;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "created_by")
    private String createdBy;

}
