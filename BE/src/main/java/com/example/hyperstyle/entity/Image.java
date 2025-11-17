package com.example.hyperstyle.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "image")
public class Image extends BaseEntity{

    @ManyToOne
    @JoinColumn(name = "id_product",referencedColumnName = "id")
    private Product product;

    @Column(name = "url")
    private String url;

    @Column(name = "status")
    private boolean status;


}
