package com.example.hyperstyle.service.Impl;

import com.example.hyperstyle.entity.Voucher;
import com.example.hyperstyle.repository.VoucherRepository;
import com.example.hyperstyle.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VoucherServiceImpl implements VoucherService {

    @Autowired
    private final VoucherRepository voucherRepository;

    @Override
    public List<Voucher> findAll() {
        return voucherRepository.findAllVoucher();
    }
}
