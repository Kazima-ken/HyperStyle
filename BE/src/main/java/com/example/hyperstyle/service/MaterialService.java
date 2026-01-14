package com.example.hyperstyle.service;

import com.example.hyperstyle.dto.request.material.CreateMaterialRequest;
import com.example.hyperstyle.dto.request.material.GetMaterialRequest;
import com.example.hyperstyle.dto.request.material.UpdateMaterialRequest;
import com.example.hyperstyle.dto.response.material.MaterialResponse;
import com.example.hyperstyle.entity.Material;

import java.util.List;

public interface MaterialService {

    List<MaterialResponse> getAll(final GetMaterialRequest request);

    Material getOneById(String id);

    Material create(final CreateMaterialRequest request);

    Material update(final UpdateMaterialRequest request);

    boolean delete(String id);

}
