package com.example.hyperstyle.service.Impl;

import com.example.hyperstyle.dto.request.category.CreateCategoryRequest;
import com.example.hyperstyle.dto.request.category.GetCategoryRequest;
import com.example.hyperstyle.dto.request.category.UpdateCategoryRequest;
import com.example.hyperstyle.dto.response.category.CategoryResponse;
import com.example.hyperstyle.entity.Category;
import com.example.hyperstyle.infrastructure.exception.rest.RestApiException;
import com.example.hyperstyle.repository.CategoryRepository;
import com.example.hyperstyle.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public List<CategoryResponse> getAll(GetCategoryRequest request) {
        return categoryRepository.getAll(request.getName(),
                request.getStatus() == null ? null : request.getStatus().name());
    }

    @Override
    public Category getOneById(String id) {
        Category category = categoryRepository.findById(id).orElseThrow(() -> new RestApiException("Category khong ton tai"));
        return category;
    }

    @Override
    public Category create(@Valid CreateCategoryRequest request) {
        Category check = categoryRepository.findByName(request.getName());
        if (check != null) {
            throw new RestApiException("Category Đã Tồn Tại");
        }
        Category category = new Category();
        category.setName(request.getName());
        category.setStatus(request.getStatus());
        return categoryRepository.save(category);
    }

    @Override
    public Category update(@Valid UpdateCategoryRequest request) {
        Category update = categoryRepository.findById(request.getId())
                .orElseThrow(() -> new RestApiException("Category Không Tồn Tại"));

        Category check = categoryRepository.findByName(request.getName());

        if (check != null && !check.getId().equals(request.getId())
                && check.getStatus().equals(request.getStatus())) {
            throw new RestApiException("Category đã tồn tại với tên và trạng thái này!");
        }

        update.setName(request.getName());
        update.setStatus(request.getStatus());

        return categoryRepository.save(update);
    }

    @Override
    public boolean delete(String id) {
        Category delete = categoryRepository.findById(id).orElseThrow(() -> new RestApiException("Category Không Tồn Tại"));
        categoryRepository.delete(delete);
        return true;
    }
}
