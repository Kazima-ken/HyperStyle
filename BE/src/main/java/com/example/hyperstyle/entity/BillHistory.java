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

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "bill_history")
public class BillHistory extends BaseEntity{

    @ManyToOne
    @JoinColumn(name = "id_employees",referencedColumnName = "id")
    private Account emplayees;

    @ManyToOne
    @JoinColumn(name = "id_bill",referencedColumnName = "id")
    private Bill bill;

    @Column(name = "action_description")
    private String actionDescription;

    @Column(name = "created_date")
    private Date createdDate;

    @Column(name = "lastModifiedDate")
    private Date lastModifiedDate;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    @Enumerated(EnumType.STRING)
    private BillStatus billStatus;

}
