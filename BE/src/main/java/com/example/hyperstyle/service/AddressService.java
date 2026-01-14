package com.example.hyperstyle.service;

import com.example.hyperstyle.dto.request.address.CreateAddressRequest;
import com.example.hyperstyle.dto.request.address.FindAddressRequest;
import com.example.hyperstyle.dto.response.address.AddressResponse;
import com.example.hyperstyle.dto.response.address.AddressUserReponse;
import com.example.hyperstyle.entity.Address;
import com.example.hyperstyle.infrastructure.constant.Status;
import org.springframework.stereotype.Service;

import java.util.List;


public interface AddressService {

    List<AddressResponse> getList(FindAddressRequest request);

    List<AddressUserReponse> getAddressByUserId(String idUser);

    List<AddressUserReponse> getAddressByAccountId(String id);

    Address create(final CreateAddressRequest req);

    Address createByAccount(final CreateAddressRequest req);

    Address getAddressByUserIdAndStatus(String id, Status status);

    Address getAddressByUserAccountAndStatus(String id, Status status);


}
