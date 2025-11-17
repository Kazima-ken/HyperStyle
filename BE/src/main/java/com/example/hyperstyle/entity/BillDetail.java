package com.example.hyperstyle.entity;

import com.example.hyperstyle.infrastructure.constant.BillStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "bill_detail")
public class BillDetail extends BaseEntity{

    @ManyToOne
    @JoinColumn(name = "id_product_detail",referencedColumnName = "id")
    private ProductDetail productDetail;

    @ManyToOne
    @JoinColumn(name = "id_bill",referencedColumnName = "id")
    private Bill bill;

    @Column(name = "created_date")
    private Date createdDate;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "price")
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    private BillStatus billStatus;

}
