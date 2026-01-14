package com.example.hyperstyle.service;

import com.example.hyperstyle.dto.request.category.CreateCategoryRequest;
import com.example.hyperstyle.dto.request.category.GetCategoryRequest;
import com.example.hyperstyle.dto.request.category.UpdateCategoryRequest;
import com.example.hyperstyle.dto.response.category.CategoryResponse;
import com.example.hyperstyle.entity.Category;
import jakarta.validation.Valid;

import java.util.List;

public interface CategoryService {

    List<CategoryResponse> getAll(final GetCategoryRequest request);

    Category getOneById(String id);

    Category create(@Valid final CreateCategoryRequest request);

    Category update(@Valid final UpdateCategoryRequest request);

    boolean delete(String id);

}
