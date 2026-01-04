package com.example.hyperstyle.service;

import com.example.hyperstyle.dto.request.address.CreateAddressRequest;
import com.example.hyperstyle.dto.request.address.UpdateAddressRequest;
import com.example.hyperstyle.dto.request.staff.CreateStaffRequest;
import com.example.hyperstyle.dto.request.staff.FindStaffRequest;
import com.example.hyperstyle.dto.request.staff.UpdateStaffRequest;
import com.example.hyperstyle.dto.response.staff.StaffFullResponse;
import com.example.hyperstyle.dto.response.staff.StaffReduceResponse;
import com.example.hyperstyle.dto.response.user.UserResponse;
import com.example.hyperstyle.entity.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface StaffService {

    List<StaffFullResponse> getAll(FindStaffRequest req);

    List<StaffFullResponse> searchDate(final FindStaffRequest req);

    User create(CreateStaffRequest req , CreateAddressRequest addressRequest,
                MultipartFile file);

    User update(final UpdateStaffRequest req, UpdateAddressRequest addressRequest,
                MultipartFile file);

    Boolean delete(String id);

    StaffReduceResponse getOneById(String id);
}
