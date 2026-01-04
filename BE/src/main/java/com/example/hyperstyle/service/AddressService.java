package com.example.hyperstyle.service;

import com.example.hyperstyle.dto.request.address.FindAddressRequest;
import com.example.hyperstyle.dto.response.address.AddressResponse;
import org.springframework.stereotype.Service;

import java.util.List;


public interface AddressService {

    List<AddressResponse> getList(FindAddressRequest request);

}
