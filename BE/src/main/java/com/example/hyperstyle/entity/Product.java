package com.example.hyperstyle.entity;

import com.example.hyperstyle.infrastructure.constant.Status;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToOne; // Giữ lại import này nếu cần cho các Entity khác
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.JoinColumn; // Giữ lại import này nếu cần cho các Entity khác
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "product")
public class Product extends BaseEntity{

    // KHÓA NGOẠI: ĐÃ ĐƯỢC COMMENT/XÓA ĐỂ TRÁNH LỖI 'Unknown column'
    // Do DB của bạn không có các cột brand_id, material_id, v.v.

    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "material_id")
    // private Material material;

    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "brand_id")
    // private Brand brand;

    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "category_id")
    // private Category category;

    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "sole_id")
    // private Sole sole;

    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;

    @Enumerated(EnumType.STRING)
    private Status status;

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<ProductDetail> productDetails;
}