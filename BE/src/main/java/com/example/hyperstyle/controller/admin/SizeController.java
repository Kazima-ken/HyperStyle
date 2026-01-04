package com.example.hyperstyle.controller.admin;

import com.example.hyperstyle.dto.request.size.CreateSizeRequest;
import com.example.hyperstyle.dto.request.size.FindSizeRequest;
import com.example.hyperstyle.dto.request.size.UpdateSizeRequest;
import com.example.hyperstyle.service.SizeService;
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
@RequestMapping("/admin/size")
@RequiredArgsConstructor
@CrossOrigin("*")
public class SizeController {

    @Autowired
    private SizeService sizeService;

    @GetMapping
    public ResponseObject<?> getAll(@ModelAttribute FindSizeRequest request){
        return ResponseObject.success(sizeService.getAll(request));
    }

    @GetMapping("/{id}")
    public ResponseObject<?> getById(@PathVariable("id") String id){
        return ResponseObject.success(sizeService.getOneById(id));
    }

    @PostMapping
    public ResponseObject<?> create(@RequestBody CreateSizeRequest request){
        return ResponseObject.success(sizeService.create(request));
    }

    @PostMapping("/{id}")
    public ResponseObject<?> update(@RequestBody @Valid UpdateSizeRequest request, @PathVariable("id")String id){
        request.setId(id);
        return ResponseObject.success(sizeService.update(request));
    }

    @DeleteMapping("/{id}")
    public ResponseObject<?> delete(@PathVariable("id") String id){
        return ResponseObject.success(sizeService.delete(id));
    }

    @GetMapping("/name/{name}")
    public ResponseObject<?> getOneByName(@PathVariable("name") String name){
        return ResponseObject.success(sizeService.getOneByName(name));
    }
    
}
