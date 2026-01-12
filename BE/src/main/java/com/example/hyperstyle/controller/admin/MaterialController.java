package com.example.hyperstyle.controller.admin;

import com.example.hyperstyle.dto.request.material.CreateMaterialRequest;
import com.example.hyperstyle.dto.request.material.GetMaterialRequest;
import com.example.hyperstyle.dto.request.material.UpdateMaterialRequest;
import com.example.hyperstyle.infrastructure.constant.Status;
import com.example.hyperstyle.service.MaterialService;
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
@RequestMapping("/admin/material")
@RequiredArgsConstructor
@CrossOrigin("*")
public class MaterialController {

    @Autowired
    private MaterialService materialService;

    @GetMapping
    public ResponseObject<?> getAll(@RequestParam(required = false) String name,
                                    @RequestParam(required = false) Status status){
        GetMaterialRequest request =new GetMaterialRequest();
        request.setName(name);
        request.setStatus(status);
        return ResponseObject.success(materialService.getAll(request));
    }

    @GetMapping("/{id}")
    public ResponseObject<?> getById(@PathVariable("id") String id){
        return ResponseObject.success(materialService.getOneById(id));
    }

    @PostMapping
    public ResponseObject<?> create(@RequestBody CreateMaterialRequest request){
        return ResponseObject.success(materialService.create(request));
    }

    @PostMapping("/{id}")
    public ResponseObject<?> update(@RequestBody @Valid UpdateMaterialRequest request, @PathVariable("id")String id){
        request.setId(id);
        return ResponseObject.success(materialService.update(request));
    }

    @DeleteMapping("/{id}")
    public ResponseObject<?> delete(@PathVariable("id") String id){
        return ResponseObject.success(materialService.delete(id));
    }
    
}
