package com.example.hyperstyle.service.Impl;

import com.example.hyperstyle.dto.request.brand.CreateBrandRequest;
import com.example.hyperstyle.dto.request.brand.GetBrandRequest;
import com.example.hyperstyle.dto.request.brand.UpdateBrandRequest;
import com.example.hyperstyle.dto.response.brand.BrandResponse;
import com.example.hyperstyle.entity.Brand;
import com.example.hyperstyle.infrastructure.exception.rest.RestApiException;
import com.example.hyperstyle.repository.BrandRepository;
import com.example.hyperstyle.service.BrandService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BrandServiceImpl implements BrandService {

    @Autowired
    BrandRepository brandRepository;

    @Override
    public List<BrandResponse> findAllBrand(GetBrandRequest request) {
        return brandRepository.getAll(request);
    }

    @Override
    public Brand createBrand(@Valid CreateBrandRequest request) {

        Brand check = brandRepository.getByName(request.getName());

        if (check != null) {
            throw new RestApiException("Brand đã tồn tại");
        }

        Brand brandAdd = new Brand();
        brandAdd.setName(request.getName());
        brandAdd.setStatus(request.getStatus());

        return brandRepository.save(brandAdd);
    }


    @Override
    public Brand updateBrand(@Valid UpdateBrandRequest request) {

        Brand brandUpdate = brandRepository.findById(request.getId())
                .orElseThrow(() -> new RestApiException("Brand Không Tồn Tại"));

        Brand check = brandRepository.getByName(request.getName());
        if (check != null && !check.getId().equals(request.getId())
                && check.getStatus().equals(request.getStatus())) {
            throw new RestApiException("Brand Đã Tồn Tại với tên và trạng thái này!");
        }

        brandUpdate.setName(request.getName());
        brandUpdate.setStatus(request.getStatus());

        return brandRepository.save(brandUpdate);
    }


    @Override
    public Boolean deleteBrand(String id) {

        Brand brandDelete = brandRepository.findById(id).orElseThrow(() -> new RestApiException("Brand Không Tồn Tại"));
        brandRepository.delete(brandDelete);
        return true;
    }

    @Override
    public Brand getOneById(String id) {
        Brand brand = brandRepository.findById(id).orElseThrow(() -> new RestApiException("Brand Không Tồn Tại"));
        return brand;
    }
}
