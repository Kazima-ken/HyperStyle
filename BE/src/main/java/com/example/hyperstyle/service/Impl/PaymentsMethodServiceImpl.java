package com.example.hyperstyle.service.Impl;

import com.example.hyperstyle.entity.Bill;
import com.example.hyperstyle.entity.PaymentsMethod;
import com.example.hyperstyle.infrastructure.exception.rest.RestApiException;
import com.example.hyperstyle.repository.BillRepository;
import com.example.hyperstyle.repository.PaymentsMethodRepository;
import com.example.hyperstyle.service.PaymentsMethodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentsMethodServiceImpl implements PaymentsMethodService {

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private PaymentsMethodRepository paymentsMethodRepository;


    @Override
    public List<PaymentsMethod> getOneByAllIdBill(String idBill) {
        Optional<Bill> bill = billRepository.findById(idBill);
        if (!bill.isPresent()) {
            throw new RestApiException("Bill Không Tồn Tại");
        }
        return paymentsMethodRepository.findAllByBill(bill.get());
    }
}
