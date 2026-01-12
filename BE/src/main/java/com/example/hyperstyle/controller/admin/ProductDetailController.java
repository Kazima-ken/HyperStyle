package com.example.hyperstyle.controller.admin;

import com.example.hyperstyle.dto.request.productDetail.GetProductDetailRequest;
import com.example.hyperstyle.dto.request.productDetail.ReturnCreateProductDetail;
import com.example.hyperstyle.dto.request.productDetail.UpdateProductDetailRequest;
import com.example.hyperstyle.dto.request.productDetail.UpdateQuantityAndPrice;
import com.example.hyperstyle.dto.response.productdetail.GetByProductDetail;
import com.example.hyperstyle.dto.response.productdetail.ProductDetailCustomerResponse;
import com.example.hyperstyle.entity.ProductDetail;
import com.example.hyperstyle.repository.ColorRepository;
import com.example.hyperstyle.repository.ProductRepository;
import com.example.hyperstyle.repository.SizeRepository;
import com.example.hyperstyle.service.ProductDetailService;
import com.example.hyperstyle.dto.request.productDetail.ProductDetailRequest;
import com.example.hyperstyle.util.ResponseObject;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    @GetMapping("/product/{id}")
    public ResponseObject<?> getOneByIdProduct(@PathVariable("id") String id) {
        return ResponseObject.success(productDetailService.getOneByIdProduct(id)
        );
    }

    @GetMapping("/{id}")
    public ResponseObject<?> getOneById(@PathVariable("id") String id) {
        GetByProductDetail result = productDetailService.getOneByIdProductDetail(id);
        if (result == null) {
            return ResponseObject.error("Không tìm thấy sản phẩm");
        }
        return ResponseObject.success(result);
    }


    @PostMapping
    public ResponseObject<?> create(@RequestBody @Valid ProductDetailRequest request) {
        return ResponseObject.success(productDetailService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseObject<?> update(
            @PathVariable String id,
            @RequestBody @Valid UpdateProductDetailRequest request
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
    public ResponseObject<?> updateList(@RequestBody List<UpdateQuantityAndPrice> requestData) {
        System.out.println(requestData);
        return ResponseObject.success(productDetailService.updateList(requestData));
    }

    @GetMapping("/client/{id}")
    public ResponseEntity<?> getOne(@PathVariable String id) {
        try {
            ProductDetailCustomerResponse response = productDetailService.getProductDetailClient(id);
            // Trả về dạng chuẩn { data: ... } như Frontend đang dùng
            return ResponseEntity.ok(Map.of("data", response));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

}