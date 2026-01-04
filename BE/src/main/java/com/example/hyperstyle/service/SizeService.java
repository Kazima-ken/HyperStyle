package com.example.hyperstyle.service;

import com.example.hyperstyle.dto.request.size.CreateSizeRequest;
import com.example.hyperstyle.dto.request.size.FindSizeRequest;
import com.example.hyperstyle.dto.request.size.UpdateSizeRequest;
import com.example.hyperstyle.dto.response.size.SizeResponse;
import com.example.hyperstyle.entity.Size;

import java.util.List;

public interface SizeService {

    List<SizeResponse> getAll(final FindSizeRequest request);

    Size getOneById(String id);

    Size create(final CreateSizeRequest request);

    Size update(final UpdateSizeRequest request);

    boolean delete(String id);

    Size getOneByName(String name);
    
}
