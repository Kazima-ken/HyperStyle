package com.example.hyperstyle.service;

import com.example.hyperstyle.dto.request.brand.CreateBrandRequest;
import com.example.hyperstyle.dto.request.brand.GetBrandRequest;
import com.example.hyperstyle.dto.request.brand.UpdateBrandRequest;
import com.example.hyperstyle.dto.response.brand.BrandResponse;
import com.example.hyperstyle.entity.Brand;
import jakarta.validation.Valid;

import java.util.List;

public interface BrandService {

    List<BrandResponse> findAllBrand(final GetBrandRequest request);

    Brand createBrand(@Valid final CreateBrandRequest request);

    Brand updateBrand(@Valid final UpdateBrandRequest request);

    Boolean deleteBrand(String id);

    Brand getOneById(String id);

}
