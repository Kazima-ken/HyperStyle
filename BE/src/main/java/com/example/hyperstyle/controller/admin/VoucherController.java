package com.example.hyperstyle.controller.admin;

import com.example.hyperstyle.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/voucher")
@RequiredArgsConstructor
@CrossOrigin("*")
public class VoucherController {

    @Autowired
    private VoucherService voucherService;



}
