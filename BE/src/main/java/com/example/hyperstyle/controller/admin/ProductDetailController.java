package com.example.hyperstyle.controller.admin;

import com.example.hyperstyle.dto.request.productDetail.GetProductDetailRequest;
import com.example.hyperstyle.dto.request.productDetail.ReturnCreateProductDetail;
import com.example.hyperstyle.dto.request.productDetail.UpdateQuantityAndPrice;
import com.example.hyperstyle.entity.ProductDetail;
import com.example.hyperstyle.repository.ColorRepository;
import com.example.hyperstyle.repository.ProductRepository;
import com.example.hyperstyle.repository.SizeRepository;
import com.example.hyperstyle.service.ProductDetailService;
import com.example.hyperstyle.dto.request.productDetail.ProductDetailRequest;
import com.example.hyperstyle.util.ResponseObject;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/product-details")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ProductDetailController {

    private final ProductDetailService productDetailService;
    private final ProductRepository productRepository;
    private final SizeRepository sizeRepository;
    private final ColorRepository colorRepository;

    @GetMapping
    public ResponseObject<?> getAll(@ModelAttribute GetProductDetailRequest request) {
        return ResponseObject.success(productDetailService.getAllActive(request
        ));
    }

    @GetMapping("/{id}")
    public ResponseObject<?> getOneById(@PathVariable("id") String id) {
        return ResponseObject.success(productDetailService.getOneById(id)
        );
    }

    @PostMapping
    public ResponseObject<?> create(@RequestBody @Valid ProductDetailRequest request) {
        return ResponseObject.success(productDetailService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseObject<?> update(
            @PathVariable String id,
            @RequestBody @Valid ProductDetailRequest request
    ) {
        ProductDetail updatedEntity = productDetailService.update(id, request);

        ReturnCreateProductDetail response = new ReturnCreateProductDetail(updatedEntity);

        return ResponseObject.success(response);
    }


    @DeleteMapping("/{id}")
    public ResponseObject<?> delete(@PathVariable String id) {
        return null;
    }

    @PutMapping("/list-data")
    public ResponseObject<?>  updateList(@RequestBody List<UpdateQuantityAndPrice> requestData) {
        System.out.println(requestData);
        return ResponseObject.success(productDetailService.updateList(requestData));
    }

}