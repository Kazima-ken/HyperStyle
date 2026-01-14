package com.example.hyperstyle.controller.admin;

import com.example.hyperstyle.service.BillHistoryService;
import com.example.hyperstyle.util.ResponseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("*")
@RequestMapping("/admin/bill-history")
public class BillHistoryRestController {

    @Autowired
    private BillHistoryService billHistoryService;

    @GetMapping("/{id}")
    public ResponseObject<?> findAllByIdBill(@PathVariable("id") String id){
        return ResponseObject.success(billHistoryService.getAllByIdBill(id));
    }

}
