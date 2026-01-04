package com.example.hyperstyle.controller.admin;

import com.example.hyperstyle.dto.request.sole.CreateSoleRequest;
import com.example.hyperstyle.dto.request.sole.FindSoleRequest;
import com.example.hyperstyle.dto.request.sole.UpdateSoleRequest;
import com.example.hyperstyle.service.SoleService;
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
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/sole")
@RequiredArgsConstructor
@CrossOrigin("*")
public class SoleController {

    @Autowired
    private SoleService soleService;

    @GetMapping
    public ResponseObject<?> getAll(@ModelAttribute FindSoleRequest request){
        return ResponseObject.success(soleService.getAll(request));
    }

    @GetMapping("/{id}")
    public ResponseObject<?> getById(@PathVariable("id") String id){
        return ResponseObject.success(soleService.getOneById(id));
    }

    @PostMapping
    public ResponseObject<?> create(@RequestBody CreateSoleRequest request){
        return ResponseObject.success(soleService.create(request));
    }

    @PostMapping("/{id}")
    public ResponseObject<?> update(@RequestBody @Valid UpdateSoleRequest request, @PathVariable("id")String id){
        request.setId(id);
        return ResponseObject.success(soleService.update(request));
    }

    @DeleteMapping("/{id}")
    public ResponseObject<?> delete(@PathVariable("id") String id){
        return ResponseObject.success(soleService.delete(id));
    }
    
}
