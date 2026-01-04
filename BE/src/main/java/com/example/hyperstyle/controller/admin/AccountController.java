package com.example.hyperstyle.controller.admin;

import com.example.hyperstyle.service.AccountService;
import com.example.hyperstyle.util.ResponseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/account")
@CrossOrigin("*")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @GetMapping()
    public ResponseObject<?> getList() {
        return  ResponseObject.success(accountService.getAll());
    }

    @GetMapping("/get-email")
    public ResponseObject<?> getOneByEmail(@RequestParam("email") String email) {
        return ResponseObject.success(accountService.getOneEmail(email));
    }
    @GetMapping("/staff")
    public ResponseObject<?> getAllSimpleEntityEmployess() {
        return ResponseObject.success(accountService.getAllStaff());
    }

    @GetMapping("/detail-account/{idBill}")
    public ResponseObject<?> getAccountUserByIdBill(@PathVariable("idBill") String idBill) {
        return ResponseObject.success(accountService.getByIdBill(idBill));
    }

}
