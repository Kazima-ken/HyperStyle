package com.example.hyperstyle.controller.admin;

import com.example.hyperstyle.dto.request.brand.CreateBrandRequest;
import com.example.hyperstyle.dto.request.brand.GetBrandRequest;
import com.example.hyperstyle.dto.request.brand.UpdateBrandRequest;
import com.example.hyperstyle.dto.request.category.GetCategoryRequest;
import com.example.hyperstyle.infrastructure.constant.Status;
import com.example.hyperstyle.service.BrandService;
import com.example.hyperstyle.util.ResponseObject;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/brand")
@RequiredArgsConstructor
@CrossOrigin("*")
public class BrandController {

    private final BrandService brandService;

    @GetMapping
    public ResponseObject<?> getAll(@RequestParam(required = false) String name,
                                    @RequestParam(required = false) Status status) {

        GetBrandRequest request = new GetBrandRequest();
        request.setName(name);
        request.setStatus(status);
        return ResponseObject.success(brandService.findAllBrand(request));
    }

    @GetMapping("/{id}")
    public ResponseObject<?> getOneById(@PathVariable("id") String id) {
        return ResponseObject.success(brandService.getOneById(id));
    }

    @PostMapping
    public ResponseObject<?> addBrand(@RequestBody CreateBrandRequest request) {
        return ResponseObject.success(brandService.createBrand(request));
    }

    @PostMapping("/{id}")
    public ResponseObject<?> updateBrand(
            @RequestBody @Valid UpdateBrandRequest request,
            @PathVariable String id
    ) {
        request.setId(id);
        return ResponseObject.success(brandService.updateBrand(request));
    }


    @DeleteMapping("/{id}")
    public ResponseObject deleteBrand(@PathVariable("id") String id) {
        return ResponseObject.success(brandService.deleteBrand(id));
    }

}

