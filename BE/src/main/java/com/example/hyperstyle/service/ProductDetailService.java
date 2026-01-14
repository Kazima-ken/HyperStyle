package com.example.hyperstyle.service;

import com.example.hyperstyle.dto.request.productDetail.GetProductDetailRequest;
import com.example.hyperstyle.dto.request.productDetail.UpdateProductDetailRequest;
import com.example.hyperstyle.dto.request.productDetail.UpdateQuantityAndPrice;
import com.example.hyperstyle.dto.response.productdetail.GetByProduct;
import com.example.hyperstyle.dto.response.productdetail.GetByProductDetail;
import com.example.hyperstyle.dto.response.productdetail.ProductDetailCustomerResponse;
import com.example.hyperstyle.dto.response.productdetail.ProductDetailResponse;
import com.example.hyperstyle.entity.ProductDetail;
import com.example.hyperstyle.dto.request.productDetail.ProductDetailRequest; // Cần tạo DTO này
import jakarta.validation.Valid;

import java.util.List;
import java.util.UUID;

public interface ProductDetailService {

    List<ProductDetailResponse> getAllActive(final GetProductDetailRequest request);

    ProductDetail create(@Valid final ProductDetailRequest request);

    ProductDetail update(@Valid final String id, UpdateProductDetailRequest request);

    List<GetByProduct> getOneByIdProduct(String id);

    GetByProductDetail getOneByIdProductDetail(String id);

    List<UpdateQuantityAndPrice> updateList(List<UpdateQuantityAndPrice> requestData);

    boolean delete(String id);


    ProductDetailCustomerResponse getProductDetailClient(String productId);

}