package com.example.hyperstyle.service;

import com.example.hyperstyle.dto.request.bill.BillRequest;
import com.example.hyperstyle.dto.request.bill.ChangeStatusBillRequest;
import com.example.hyperstyle.dto.request.bill.CreateBillRequest;
import com.example.hyperstyle.dto.response.ShipRequest;
import com.example.hyperstyle.dto.response.bill.BillResponse;
import com.example.hyperstyle.dto.response.bill.BillReturnedResponse;
import com.example.hyperstyle.dto.response.bill.FindBillByStatusRespose;
import com.example.hyperstyle.entity.Bill;

import java.util.List;

public interface BillService {

    List<BillResponse> getAll(String id, BillRequest request);

    List<FindBillByStatusRespose> getAllSatusBill();

    Bill create(String staffEmail, CreateBillRequest request);

    Bill getOneByid(String id);

    boolean getShipBill (ShipRequest request);

    int countPayMentPostpaidByIdBill(String id);

    List<BillReturnedResponse> getBillReturned(String idBill);

    Bill changedStatusbill(String id, String emailStaff, ChangeStatusBillRequest request);


}
