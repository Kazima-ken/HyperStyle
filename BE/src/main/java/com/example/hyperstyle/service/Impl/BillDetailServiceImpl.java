package com.example.hyperstyle.service.Impl;

import com.example.hyperstyle.dto.request.bill.BillDetailRequest;
import com.example.hyperstyle.dto.response.BillDetailResponse;
import com.example.hyperstyle.repository.BillDetailRepository;
import com.example.hyperstyle.service.BillDetailService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;


@Service
@Transactional
public class BillDetailServiceImpl implements BillDetailService {

    @Autowired
    private BillDetailRepository billDetailRepository;

    @Override
    public List<BillDetailResponse> getAllByIdBill(BillDetailRequest request) {
        return billDetailRepository.findAllByIdBill(request);
    }

}