package com.example.hyperstyle.controller.admin;


import com.example.hyperstyle.dto.request.bill.BillRequest;
import com.example.hyperstyle.dto.request.bill.ChangeStatusBillRequest;
import com.example.hyperstyle.dto.request.bill.CreateBillRequest;
import com.example.hyperstyle.dto.response.ShipRequest;
import com.example.hyperstyle.infrastructure.session.ShoseSession;
import com.example.hyperstyle.infrastructure.session.UserDetailToken;
import com.example.hyperstyle.service.BillService;
import com.example.hyperstyle.util.ResponseObject;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/bill")
@CrossOrigin("*")
@RequiredArgsConstructor
public class BillController {

    @Autowired
    private BillService billService;

    @Autowired
    private ShoseSession shoseSession;

// BillController.java

    @GetMapping
    public ResponseObject<?> getAll(BillRequest request) {
        UserDetailToken staff = shoseSession.getStaff();

        String email = (staff != null) ? staff.getEmail() : null;

        return ResponseObject.success(billService.getAll(email, request));
    }

    @GetMapping("/status-bill")
    public ResponseObject<?> getAllStatusBill() {
        return ResponseObject.success(billService.getAllSatusBill());
    }

    @PostMapping("")
    public ResponseObject<?> create(@RequestBody CreateBillRequest request) {
        try {
            UserDetailToken staff = shoseSession.getStaff();

            String email = (staff != null) ? staff.getEmail() : null;

            return ResponseObject.success(billService.create(email, request));
        } catch (Exception e) {
            return ResponseObject.error("Tạo hóa đơn thất bại: " + e.getMessage());
        }
    }

    @GetMapping("/detail/{id}")
    public ResponseObject<?> getOneByid(@PathVariable("id") String id) {
        return ResponseObject.success(billService.getOneByid(id));
    }

    @PostMapping("/ship-bill")
    public ResponseObject<?> UpdateShipBill(@RequestBody ShipRequest request) {
        return ResponseObject.success(billService.getShipBill(request));
    }

    @GetMapping("/count-paymet-post-paid/{id}")
    public ResponseObject<?> countPayMentPostpaidByIdBill(@PathVariable("id") String id) {
        return ResponseObject.success(billService.countPayMentPostpaidByIdBill(id));
    }

    @PutMapping("/change-status/{id}")
    public ResponseObject<?> changStatusBill(@PathVariable("id") String id,
                                             @RequestBody ChangeStatusBillRequest request) {
        return ResponseObject.success(billService.changedStatusbill(id, shoseSession.getStaff().getEmail(), request));
    }

    @GetMapping("/give-back")
    public ResponseObject<?> BillGiveBack(@RequestParam("idBill") String ibBill) {
        return ResponseObject.success(billService.getBillReturned(ibBill));
    }


}
