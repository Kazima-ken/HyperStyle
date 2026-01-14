package com.example.hyperstyle.service.Impl;

import com.example.hyperstyle.dto.request.size.CreateSizeRequest;
import com.example.hyperstyle.dto.request.size.FindSizeRequest;
import com.example.hyperstyle.dto.request.size.UpdateSizeRequest;
import com.example.hyperstyle.dto.response.size.SizeResponse;
import com.example.hyperstyle.entity.Size;
import com.example.hyperstyle.infrastructure.exception.rest.RestApiException;
import com.example.hyperstyle.repository.SizeRepository;
import com.example.hyperstyle.service.SizeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SizeServiceImpl implements SizeService {

    @Autowired
    private SizeRepository sizeRepository;

    @Override
    public List<SizeResponse> getAll(FindSizeRequest request) {
        return sizeRepository.getAll(request);
    }

    @Override
    public Size getOneById(String id) {
        Size size = sizeRepository.findById(id).orElseThrow(() -> new RestApiException("Size khong ton tai"));
        return size;
    }

    @Override
    public Size create(@Valid CreateSizeRequest request) {
        String name = request.getName().trim();
        int sizeValue;

        try {
            sizeValue = Integer.parseInt(name);
        } catch (NumberFormatException e) {
            throw new RestApiException("Kích cỡ phải là số!");
        }

        // Chặn theo yêu cầu mới: 30 < size < 60
        if (sizeValue <= 30 || sizeValue >= 60) {
            throw new RestApiException("Kích cỡ phải nằm trong khoảng từ 31 đến 59!");
        }

        if (sizeRepository.existsByName(name)) {
            throw new RestApiException("Kích cỡ đã tồn tại!");
        }

        Size size = new Size();
        size.setName(name);
        size.setStatus(request.getStatus());
        return sizeRepository.save(size);
    }

    @Override
    public Size update(@Valid UpdateSizeRequest request) {
        Size update = sizeRepository.findById(request.getId())
                .orElseThrow(() -> new RestApiException("Size Không Tồn Tại"));

        Size check = sizeRepository.findByName(request.getName());
        if (check != null && !check.getId().equals(request.getId())
                && check.getStatus().equals(request.getStatus())) {
            throw new RestApiException("Size Đã Tồn Tại với tên và trạng thái này!");
        }

        update.setName(request.getName());
        update.setStatus(request.getStatus());

        return sizeRepository.save(update);
    }

    @Override
    public boolean delete(String id) {
        Size delete = sizeRepository.findById(id).orElseThrow(() -> new RestApiException("Size Không Tồn Tại"));
        sizeRepository.delete(delete);
        return true;
    }

    @Override
    public Size getOneByName(String name) {
        Size check = sizeRepository.findByName(name);
        if (check == null) {
            throw new RestApiException("Size Không Tồn Tại");
        }
        return check;
    }
}
