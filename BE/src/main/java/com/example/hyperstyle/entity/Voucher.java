package com.example.hyperstyle.entity;

import com.example.hyperstyle.infrastructure.constant.Status;
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
@Table(name = "voucher")
public class Voucher extends BaseEntity{

    @ManyToOne
    @JoinColumn(name = "id_bill",referencedColumnName = "id")
    private Bill bill;

    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;

    @Column(name = "value")
    private BigDecimal value;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "start_date")
    private Date startDate;

    @Column(name = "end_date")
    private Date endDate;

    @Column(name = "max_discount")
    private BigDecimal maxDiscount;

    @Column(name = "minimum_bill")
    private Integer minimumBill;

    @Column(name = "created_date")
    private Date createdDate;

    @Enumerated(EnumType.STRING)
    private Status status;

}
