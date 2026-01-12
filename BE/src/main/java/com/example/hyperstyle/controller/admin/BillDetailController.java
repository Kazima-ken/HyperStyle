package com.example.hyperstyle.controller.admin;

import com.example.hyperstyle.dto.request.bill.BillDetailRequest;
import com.example.hyperstyle.infrastructure.session.ShoseSession;
import com.example.hyperstyle.service.BillDetailService;
import com.example.hyperstyle.service.BillService;
import com.example.hyperstyle.util.ResponseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/bill-detail")
@CrossOrigin("*")
public class BillDetailController {

    @Autowired
    private BillService billService;

    @Autowired
    private BillDetailService billDetailService;

    @Autowired
    private ShoseSession shoseSession;

    @GetMapping("")
    public ResponseObject<?> getAllByIdBill(@ModelAttribute BillDetailRequest request) {
        return ResponseObject.success(billDetailService.getAllByIdBill(request));
    }


}
