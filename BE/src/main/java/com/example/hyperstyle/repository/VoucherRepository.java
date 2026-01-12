package com.example.hyperstyle.repository;

import com.example.hyperstyle.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, String> {

    @Query(value = """
            select 
            vo.id as id, 
            vo.code as code,
            vo.name as name,
            vo.quantity as quantity,
            vo.start_date as stateDate,
            vo.end_date as endDate,
            vo.max_discount as maxDiscount,
            vo.min_discount as minDiscount,
            vo.create_date as createDate,
            vo.status as status
                                   
            from Voucher vo
            where vo.status ='DANG_SU_DUNG'
             
            """, nativeQuery = true)
    List<Voucher> findAllVoucher();
}
