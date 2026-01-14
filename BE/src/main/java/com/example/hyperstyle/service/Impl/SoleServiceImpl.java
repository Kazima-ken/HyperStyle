package com.example.hyperstyle.service.Impl;


import com.example.hyperstyle.dto.request.sole.CreateSoleRequest;
import com.example.hyperstyle.dto.request.sole.FindSoleRequest;
import com.example.hyperstyle.dto.request.sole.UpdateSoleRequest;
import com.example.hyperstyle.dto.response.sole.SoleResponse;
import com.example.hyperstyle.entity.Sole;
import com.example.hyperstyle.infrastructure.exception.rest.RestApiException;
import com.example.hyperstyle.repository.SoleRepository;
import com.example.hyperstyle.service.SoleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SoleServiceImpl implements SoleService {

    @Autowired
    private SoleRepository soleRepository;

    @Override
    public List<SoleResponse> getAll(FindSoleRequest request) {
        return soleRepository.getAll(
                request.getName(),
                request.getStatus() == null ? null : request.getStatus().name()
        );
    }

    @Override
    public Sole getOneById(String id) {
        Sole sole = soleRepository.findById(id).orElseThrow(() -> new RestApiException("Sole khong ton tai"));
        return sole;
    }

    @Override
    public Sole create(@Valid CreateSoleRequest request) {
        Sole check = soleRepository.findByName(request.getName());

        if (check != null) {
            throw new RestApiException("Sole Đã Tồn Tại");
        }
        Sole sole = new Sole();
        sole.setName(request.getName());
        sole.setStatus(request.getStatus());
        return soleRepository.save(sole);
    }

    @Override
    public Sole update(@Valid UpdateSoleRequest request) {
        Sole update = soleRepository.findById(request.getId())
                .orElseThrow(() -> new RestApiException("Sole Không Tồn Tại"));

        Sole check = soleRepository.findByName(request.getName());
        if (check != null && !check.getId().equals(request.getId())
                && check.getStatus().equals(request.getStatus())) {
            throw new RestApiException("Sole Đã Tồn Tại với tên và trạng thái này!");
        }

        update.setName(request.getName());
        update.setStatus(request.getStatus());

        return soleRepository.save(update);
    }

    @Override
    public boolean delete(String id) {
        Sole delete = soleRepository.findById(id).orElseThrow(() -> new RestApiException("Sole Không Tồn Tại"));
        soleRepository.delete(delete);
        return true;
    }

}
