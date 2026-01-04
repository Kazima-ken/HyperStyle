package com.example.hyperstyle.service.Impl;

import com.example.hyperstyle.dto.request.address.FindAddressRequest;
import com.example.hyperstyle.dto.response.address.AddressResponse;
import com.example.hyperstyle.repository.AddressRepository;
import com.example.hyperstyle.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressServiceImpl implements AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Override
    public List<AddressResponse> getList(FindAddressRequest request) {
        return addressRepository.getAll(request);
    }
}
