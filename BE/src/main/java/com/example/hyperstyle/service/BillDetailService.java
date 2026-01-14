package com.example.hyperstyle.service;


import com.example.hyperstyle.dto.request.bill.BillDetailRequest;
import com.example.hyperstyle.dto.response.BillDetailResponse;

import java.util.List;


public interface BillDetailService {

    List<BillDetailResponse> getAllByIdBill(BillDetailRequest request);

}