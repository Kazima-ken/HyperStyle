package com.example.hyperstyle.service.Impl;

import com.example.hyperstyle.dto.request.address.CreateAddressRequest;
import com.example.hyperstyle.dto.request.address.UpdateAddressRequest;
import com.example.hyperstyle.dto.request.customer.CreateCustomerRequest;
import com.example.hyperstyle.dto.request.customer.UpdateByUserClient;
import com.example.hyperstyle.dto.request.customer.UpdateCustomerRequest;
import com.example.hyperstyle.dto.request.staff.FindStaffRequest;
import com.example.hyperstyle.dto.response.user.UserResponse;
import com.example.hyperstyle.entity.User;
import com.example.hyperstyle.service.CustomerService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Override
    public List<UserResponse> findAll(FindStaffRequest request) {
        return null;
    }

    @Override
    public User create(CreateCustomerRequest request, CreateAddressRequest addressRequest, MultipartFile file) {
        return null;
    }

    @Override
    public User update(UpdateCustomerRequest request, UpdateAddressRequest addressRequest, MultipartFile file) {
        return null;
    }

    @Override
    public User updateInfoClient(UpdateByUserClient request) {
        return null;
    }

    @Override
    public Boolean delete(String id) {
        return null;
    }

    @Override
    public UserResponse getOneById(String id) {
        return null;
    }

    @Override
    public UserResponse getOneByPhoneNumber(String phoneNumber) {
        return null;
    }

    @Override
    public User findByEmail(String email) {
        return null;
    }
}
