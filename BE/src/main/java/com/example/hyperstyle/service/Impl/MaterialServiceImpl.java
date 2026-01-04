package com.example.hyperstyle.service.Impl;

import com.example.hyperstyle.dto.request.material.CreateMaterialRequest;
import com.example.hyperstyle.dto.request.material.GetMaterialRequest;
import com.example.hyperstyle.dto.request.material.UpdateMaterialRequest;
import com.example.hyperstyle.dto.response.material.MaterialResponse;
import com.example.hyperstyle.entity.Material;
import com.example.hyperstyle.infrastructure.exception.rest.RestApiException;
import com.example.hyperstyle.repository.MaterialRepository;
import com.example.hyperstyle.service.MaterialService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaterialServiceImpl implements MaterialService{

    @Autowired
    private MaterialRepository materialRepository;

    @Override
    public List<MaterialResponse> getAll(GetMaterialRequest request) {
        return materialRepository.getAll(request);
    }

    @Override
    public Material getOneById(String id) {
        Material material = materialRepository.findById(id).orElseThrow(() -> new RestApiException("Material khong ton tai"));
        return material;
    }

    @Override
    public Material create(@Valid CreateMaterialRequest request) {
        Material check = materialRepository.findByName(request.getName());
        if (check != null) {
            throw new RestApiException("Material Đã Tồn Tại");
        }
        Material material = new Material();
        material.setName(request.getName());
        material.setStatus(request.getStatus());
        return materialRepository.save(material);
    }

    @Override
    public Material update(@Valid UpdateMaterialRequest request) {
        Material update = materialRepository.findById(request.getId())
                .orElseThrow(() -> new RestApiException("Material Không Tồn Tại"));

        Material check = materialRepository.findByName(request.getName());
        if (check != null && !check.getId().equals(request.getId())
                && check.getStatus().equals(request.getStatus())) {
            throw new RestApiException("Material Đã Tồn Tại với tên và trạng thái này!");
        }

        update.setName(request.getName());
        update.setStatus(request.getStatus());

        return materialRepository.save(update);
    }

    @Override
    public boolean delete(String id) {
        Material delete = materialRepository.findById(id).orElseThrow(() -> new RestApiException("Material Không Tồn Tại"));
        materialRepository.delete(delete);
        return true;
    }
    
}
