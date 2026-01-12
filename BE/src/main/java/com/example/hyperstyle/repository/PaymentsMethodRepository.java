package com.example.hyperstyle.repository;

import com.example.hyperstyle.entity.Bill;
import com.example.hyperstyle.entity.PaymentsMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentsMethodRepository extends JpaRepository<PaymentsMethod, String> {

    List<PaymentsMethod> findAllByBill(Bill bill);

    @Query(value = """
             SELECT COUNT(id) FROM payments_method
             WHERE id_bill = :idBill
             AND status = 'TRA_SAU'
            """, nativeQuery = true)
    int countPayMentPostpaidByIdBill(@Param("idBill") String idBill);

    @Modifying
    @Query(value = """
                    UPDATE payments_method pa
                    SET pa.status = 'THANH_TOAN'
                    WHERE pa.id_bill = :idBill
                    """, nativeQuery = true)
    void updateAllByIdBill(@Param("idBill") String idBill);

}
