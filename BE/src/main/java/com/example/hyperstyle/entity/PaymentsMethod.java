package com.example.hyperstyle.entity;

import com.example.hyperstyle.infrastructure.constant.Method;
import com.example.hyperstyle.infrastructure.constant.PaymentStatus;
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
import lombok.ToString;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Getter
@Setter
@Builder
@Table(name = "payments_method")
@AllArgsConstructor
@NoArgsConstructor
public class PaymentsMethod extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "id_bill")
    private Bill bill;

    @ManyToOne
    @JoinColumn(name = "id_employees")
    private Account employees;

    @Enumerated(EnumType.STRING)
    @Column(name = "method")
    private Method method;

    @Column(name = "description")
    private String description;

    @Column(name = "total_money")
    private BigDecimal totalMoney;

    @Column(name = "vnp_transaction")
    private String vnpTransaction;

    @Column(name = "created_by")
    private String createdBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private PaymentStatus paymentStatus;

    @Column(name = "created_date", insertable = false, updatable = false) // Thường created_date DB tự sinh
    private Date createdDate;
}
