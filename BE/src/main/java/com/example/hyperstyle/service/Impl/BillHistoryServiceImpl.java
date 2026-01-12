package com.example.hyperstyle.service.Impl;


import com.example.hyperstyle.dto.response.bill.BillHistoryResponse;
import com.example.hyperstyle.repository.BillHistoryRepository;
import com.example.hyperstyle.service.BillHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class BillHistoryServiceImpl implements BillHistoryService {

    @Autowired
    private BillHistoryRepository billHistoryRepository;

    @Override
    public List<BillHistoryResponse> getAllByIdBill(String idBill) {
        return billHistoryRepository.findAllByIdBill(idBill);
    }
}
