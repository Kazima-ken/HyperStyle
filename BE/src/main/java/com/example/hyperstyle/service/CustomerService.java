package com.example.hyperstyle.service;

import com.example.hyperstyle.dto.request.address.CreateAddressRequest;
import com.example.hyperstyle.dto.request.address.UpdateAddressRequest;
import com.example.hyperstyle.dto.request.customer.CreateCustomerRequest;
import com.example.hyperstyle.dto.request.customer.FindCustomerRequest;
import com.example.hyperstyle.dto.request.customer.UpdateByUserClient;
import com.example.hyperstyle.dto.request.customer.UpdateCustomerRequest;
import com.example.hyperstyle.dto.request.staff.FindStaffRequest;
import com.example.hyperstyle.dto.response.user.UserResponse;
import com.example.hyperstyle.entity.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CustomerService {

    List<UserResponse> findAll(FindCustomerRequest request);

    User create(CreateCustomerRequest request,
                CreateAddressRequest addressRequest,
                MultipartFile file);

    User update(UpdateCustomerRequest request,
                UpdateAddressRequest addressRequest,
                MultipartFile file);

    User updateInfoClient(UpdateByUserClient request);

    Boolean delete(String id);

    UserResponse getOneById(String id);

    UserResponse getOneByPhoneNumber(String phoneNumber);

    User findByEmail(String email);
}
