package com.example.hyperstyle.controller.admin;

import com.example.hyperstyle.dto.request.image.ImageRequest;
import com.example.hyperstyle.dto.request.product.CreateProductRequest;
import com.example.hyperstyle.dto.request.product.GetProductRequest;
import com.example.hyperstyle.dto.request.product.UpdateProductRequest;
import com.example.hyperstyle.infrastructure.exception.rest.RestApiException;
import com.example.hyperstyle.service.ProductService;
import com.example.hyperstyle.util.ResponseObject;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/admin/product")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ProductController {

    private final ProductService productService;


    @GetMapping
    public ResponseObject<?> getAll(@ModelAttribute GetProductRequest request) {
        return ResponseObject.success(productService.getAllProduct(request));
    }

    @GetMapping("/{id}")
    public ResponseObject<?> getOneById(@PathVariable("id") String id) {
        return ResponseObject.success(productService.getOneById(id));
    }


    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseObject<?> addProduct(
            @RequestPart("request") String requestString,
            @RequestPart("file") MultipartFile file
    ) throws ExecutionException, InterruptedException, JsonProcessingException {

        if (file == null || file.isEmpty()) {
            throw new RestApiException("Vui lòng chọn ảnh cho sản phẩm!");
        }

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        CreateProductRequest request;
        try {
            request = objectMapper.readValue(requestString, CreateProductRequest.class);
        } catch (JsonProcessingException e) {
            throw new RestApiException("Dữ liệu JSON không đúng định dạng: " + e.getMessage());
        }

        ImageRequest imgReq = new ImageRequest();
        imgReq.setFiles(file);
        imgReq.setColor("default");

        List<ImageRequest> listImageRequest = new ArrayList<>();
        listImageRequest.add(imgReq);

        return ResponseObject.success(productService.create(request, listImageRequest));
    }


    @PostMapping("/{id}") // 1. Đổi Post thành Put cho đúng chuẩn update
    public ResponseObject<?> updateProduct(
            @PathVariable String id,
            @RequestPart("request") String requestString, // 2. Nhận JSON dạng String (tránh lỗi 415)
            @RequestPart(value = "file", required = false) List<MultipartFile> files
    ) throws ExecutionException, InterruptedException, JsonProcessingException {

        // Parse JSON sang Object
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        UpdateProductRequest request = objectMapper.readValue(requestString, UpdateProductRequest.class);

        // Set ID từ URL vào request
        request.setId(id);

        // Xử lý ảnh (nếu có gửi ảnh mới)
        List<ImageRequest> listImageRequest = new ArrayList<>();
        if (files != null && !files.isEmpty()) {
            listImageRequest = files.stream()
                    .map(file -> {
                        ImageRequest imgReq = new ImageRequest();
                        imgReq.setFiles(file);
                        imgReq.setColor("default");
                        return imgReq;
                    })
                    .collect(Collectors.toList());
        }

        return ResponseObject.success(productService.update(request, listImageRequest));
    }


    @DeleteMapping("/{id}")
    public ResponseObject deleteProduct(@PathVariable("id") String id) {
        return ResponseObject.success(productService.delete(id));
    }

    @GetMapping("/getByName")
    public ResponseObject<?> getAllName(String name) {
        return ResponseObject.success(productService.getAllByName(name));
    }

}
