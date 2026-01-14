package com.example.hyperstyle.controller.admin;

import com.example.hyperstyle.infrastructure.session.ShoseSession;
import com.example.hyperstyle.service.PaymentsMethodService;
import com.example.hyperstyle.util.ResponseObject;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/payment-method")
@CrossOrigin("*")
@RequiredArgsConstructor
public class PaymentsMethodController {

    private final ShoseSession shoseSession;

    private final PaymentsMethodService paymentsMethodService;

    @GetMapping("/bill/{id}")
    public ResponseObject<?> findByIdBill(@PathVariable("id") String id){
        return ResponseObject.success(paymentsMethodService.getOneByAllIdBill(id));
    }

}
