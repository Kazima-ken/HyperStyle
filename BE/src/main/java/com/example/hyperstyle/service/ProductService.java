package com.example.hyperstyle.service;

import com.example.hyperstyle.dto.request.image.ImageRequest;
import com.example.hyperstyle.dto.request.product.CreateProductRequest;
import com.example.hyperstyle.dto.request.product.GetProductByNameRequest;
import com.example.hyperstyle.dto.request.product.ReturnCreateProduct;
import com.example.hyperstyle.dto.request.product.UpdateProductRequest;
import com.example.hyperstyle.dto.request.product.GetProductRequest;
import com.example.hyperstyle.dto.response.product.ProductResponse;
import com.example.hyperstyle.entity.Product;
import jakarta.validation.Valid;

import java.util.List;
import java.util.concurrent.ExecutionException;

public interface ProductService {

    List<ProductResponse> getAllProduct(final GetProductRequest request);

    Product getOneById(String id);

    List<String> getAllByName(String name);

    ReturnCreateProduct create(@Valid CreateProductRequest request,
                               List<ImageRequest> listImageRequest) throws ExecutionException, InterruptedException;

    Product update(@Valid UpdateProductRequest request, List<ImageRequest> images);

    boolean delete(String id);

}
