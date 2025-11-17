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

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "voucher_detail")
public class VoucherDetail extends BaseEntity{

    @ManyToOne
    @JoinColumn(name = "id_voucher",referencedColumnName = "id")
    private Voucher voucher;

    @Column(name = "befor_price")
    private BigDecimal beforPrice;

    @Column(name = "after_price")
    private BigDecimal afterPrice;

    @Column(name = "discount_price")
    private BigDecimal discountPrice;

}
