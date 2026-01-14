package com.example.hyperstyle.controller.admin;

import com.example.hyperstyle.dto.request.category.CreateCategoryRequest;
import com.example.hyperstyle.dto.request.category.GetCategoryRequest;
import com.example.hyperstyle.dto.request.category.UpdateCategoryRequest;
import com.example.hyperstyle.infrastructure.constant.Status;
import com.example.hyperstyle.service.CategoryService;
import com.example.hyperstyle.util.ResponseObject;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
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
@RequestMapping("/admin/category")
@RequiredArgsConstructor
@CrossOrigin("*")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ResponseObject<?> getAll(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Status status
    ) {
        GetCategoryRequest request = new GetCategoryRequest();
        request.setName(name);
        request.setStatus(status);

        return ResponseObject.success(categoryService.getAll(request));
    }


    @GetMapping("/{id}")
    public ResponseObject<?> getById(@PathVariable("id") String id){
        return ResponseObject.success(categoryService.getOneById(id));
    }

    @PostMapping
    public ResponseObject<?> create(@RequestBody CreateCategoryRequest request){
        return ResponseObject.success(categoryService.create(request));
    }

    @PostMapping("/{id}")
    public ResponseObject<?> update(@RequestBody @Valid UpdateCategoryRequest request, @PathVariable("id")String id){
        request.setId(id);
        return ResponseObject.success(categoryService.update(request));
    }

    @DeleteMapping("/{id}")
    public ResponseObject<?> delete(@PathVariable("id") String id){
        return ResponseObject.success(categoryService.delete(id));
    }

}
