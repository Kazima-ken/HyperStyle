package com.example.hyperstyle.service.Impl;

import com.example.hyperstyle.dto.request.address.CreateAddressRequest;
import com.example.hyperstyle.dto.request.address.UpdateAddressRequest;
import com.example.hyperstyle.dto.request.staff.CreateStaffRequest;
import com.example.hyperstyle.dto.request.staff.FindStaffRequest;
import com.example.hyperstyle.dto.request.staff.UpdateStaffRequest;
import com.example.hyperstyle.dto.response.staff.StaffFullResponse;
import com.example.hyperstyle.dto.response.staff.StaffReduceResponse;
import com.example.hyperstyle.dto.response.user.UserResponse;
import com.example.hyperstyle.entity.User;
import com.example.hyperstyle.repository.UserRepository;
import com.example.hyperstyle.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class StaffServiceImpl implements StaffService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<StaffFullResponse> getAll(FindStaffRequest request) {
        return userRepository.getAll(request);
    }

    @Override
    public List<StaffFullResponse> searchDate(FindStaffRequest req) {
        return null;
    }

    @Override
    public User create(CreateStaffRequest req, CreateAddressRequest addressRequest, MultipartFile file) {
        return null;
    }

    @Override
    public User update(UpdateStaffRequest req, UpdateAddressRequest addressRequest, MultipartFile file) {
        return null;
    }

    @Override
    public Boolean delete(String id) {
        return null;
    }

    @Override
    public StaffReduceResponse getOneById(String id) {
        return null;
    }
}
