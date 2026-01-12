package com.example.hyperstyle.repository;

import com.example.hyperstyle.dto.response.bill.BillHistoryResponse;
import com.example.hyperstyle.entity.Bill;
import com.example.hyperstyle.entity.BillHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BillHistoryRepository extends JpaRepository<BillHistory, String> {

    @Query(value = """
            SELECT ROW_NUMBER() OVER( ORDER BY bihi.created_date ASC ) AS stt, bihi.id, bihi.status_bill, bihi.created_date, bihi.action_description, us.full_name\s
                            FROM bill_history bihi
                            LEFT JOIN bill bi ON bi.id = bihi.id_bill
                            LEFT JOIN account ac On ac.id = bihi.id_employees
                            LEFT JOIN user us On us.id = ac.id_user
                            WHERE id_bill = :idBill
                            ORDER BY bihi.created_date ASC
            """, nativeQuery = true)
    List<BillHistoryResponse> findAllByIdBill(String idBill);

    List<BillHistory> findAllByBill(Bill bill);

}
