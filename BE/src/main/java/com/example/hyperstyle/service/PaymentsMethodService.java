package com.example.hyperstyle.service;

import com.example.hyperstyle.entity.PaymentsMethod;

import java.util.List;

public interface PaymentsMethodService {

    List<PaymentsMethod> getOneByAllIdBill(String idBill);

}
