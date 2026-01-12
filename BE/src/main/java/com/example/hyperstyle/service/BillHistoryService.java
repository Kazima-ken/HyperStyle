package com.example.hyperstyle.service;


import com.example.hyperstyle.dto.response.bill.BillHistoryResponse;

import java.util.List;


public interface BillHistoryService {

    List<BillHistoryResponse> getAllByIdBill(String idBill);

}