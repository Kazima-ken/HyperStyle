package com.example.hyperstyle.entity;

import com.example.hyperstyle.infrastructure.constant.BillType;
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
@Table(name = "bill")
public class Bill extends BaseEntity{

    @ManyToOne
    @JoinColumn(name = "id_account",referencedColumnName = "id")
    private Account account;

    @ManyToOne
    @JoinColumn(name = "id_employees",referencedColumnName = "id")
    private Account employees;

    @ManyToOne
    @JoinColumn(name = "id_voucher",referencedColumnName = "id")
    private Voucher voucher;

    @Column(name = "code")
    private String code;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "address")
    private String address;

    @Column(name = "user_name")
    private String userUame;

    @Column(name = "email")
    private String email;

    @Column(name = "item_discount")
    private BigDecimal itemDiscount;

    @Column(name = "total_money")
    private BigDecimal totalMoney;

    @Column(name = "befor_price")
    private BigDecimal beforPrice;

    @Column(name = "after_price")
    private BigDecimal afterPrice;

    @Column(name = "discount_price")
    private BigDecimal discountPrice;

    @Column(name = "confirmation_date")
    private Date confirmationDate;

    @Column(name = "shipping_date")
    private Date shippingDate;

    @Column(name = "receive_date")
    private Date receiveDate;

    @Column(name = "completion_date")
    private Date completionDate;

    @Enumerated(EnumType.STRING)
    private BillType type;

    @Column(name = "note")
    private String note;

    @Column(name = "money_ship")
    private BigDecimal moneyShip;

    @Column(name = "last_modified_date")
    private Date lastModifiedMate;

    @Column(name = "created_date")
    private Date createdDate;

    @Column(name = "create_by")
    private String createBy;

    @Enumerated(EnumType.STRING)
    private BillStatus billStatus;

}
