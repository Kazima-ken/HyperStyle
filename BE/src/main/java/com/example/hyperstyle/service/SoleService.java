package com.example.hyperstyle.service;

import com.example.hyperstyle.dto.request.sole.CreateSoleRequest;
import com.example.hyperstyle.dto.request.sole.FindSoleRequest;
import com.example.hyperstyle.dto.request.sole.UpdateSoleRequest;
import com.example.hyperstyle.dto.response.sole.SoleResponse;
import com.example.hyperstyle.entity.Sole;

import java.util.List;

public interface SoleService {

    List<SoleResponse> getAll(final FindSoleRequest request);

    Sole getOneById(String id);

    Sole create(final CreateSoleRequest request);

    Sole update(final UpdateSoleRequest request);

    boolean delete(String id);

}
