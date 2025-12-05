package com.example.hyperstyle.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import com.example.hyperstyle.infrastructure.constant.Gender;
import com.example.hyperstyle.infrastructure.constant.Status;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;
// Thêm các imports cần thiết khác nếu có (ví dụ: Auditing, GenericGenerator,...)

/**
 * Entity đại diện cho bảng 'product_detail' (Chi tiết sản phẩm)
 * Chứa thông tin về số lượng, giá, và quan hệ khóa ngoại.
 */
@Entity
@Table(name = "product_detail")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetail {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    private String id;

    // --- CÁC TRƯỜNG THÔNG THƯỜNG ---

    @Column(name = "price")
    private BigDecimal price;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender; // Đảm bảo Gender enum được định nghĩa

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status; // Đảm bảo Status enum được định nghĩa

    // --- QUAN HỆ KHÓA NGOẠI (FOREIGN KEYS) ---

    // 1. Quan hệ với Product
    // Đã sửa tên cột khóa ngoại thành "id_product" để khớp với giả định của bạn
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_product", referencedColumnName = "id", nullable = false)
    @JsonIgnore
    private Product product;

    // 2. Quan hệ với Color
    // Đã sửa tên cột khóa ngoại thành "id_color"
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_color", referencedColumnName = "id", nullable = false)
    private Color color;

    // 3. Quan hệ với Size
    // Đã sửa tên cột khóa ngoại thành "id_size"
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_size", referencedColumnName = "id", nullable = false)
    private Size size;
}