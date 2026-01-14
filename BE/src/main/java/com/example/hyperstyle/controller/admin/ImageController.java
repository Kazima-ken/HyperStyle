package com.example.hyperstyle.controller.admin;

import com.example.hyperstyle.entity.Image;
import com.example.hyperstyle.repository.ImageRepository;
import com.example.hyperstyle.service.ImageService;
import com.example.hyperstyle.util.ResponseObject;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/image")
@RequiredArgsConstructor // Lombok tự tạo constructor cho imageService
public class ImageController {

    private final ImageService imageService;

    @GetMapping("/{idProduct}")
    public ResponseObject<?> getAllById(@PathVariable("idProduct") String idProduct) {
        return ResponseObject.success(imageService.getAllByProductId(idProduct));
    }
}
