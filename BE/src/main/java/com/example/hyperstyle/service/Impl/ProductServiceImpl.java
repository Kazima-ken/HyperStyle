package com.example.hyperstyle.service.Impl;

import com.example.hyperstyle.dto.request.image.ImageRequest;
import com.example.hyperstyle.dto.request.product.CreateProductRequest;
import com.example.hyperstyle.dto.request.product.GetProductByNameRequest;
import com.example.hyperstyle.dto.request.product.GetProductRequest;
import com.example.hyperstyle.dto.request.product.ReturnCreateProduct;
import com.example.hyperstyle.dto.request.product.UpdateProductRequest;
import com.example.hyperstyle.dto.response.product.ProductResponse;
import com.example.hyperstyle.entity.Brand;
import com.example.hyperstyle.entity.Category;
import com.example.hyperstyle.entity.Image;
import com.example.hyperstyle.entity.Material;
import com.example.hyperstyle.entity.Product;
import com.example.hyperstyle.entity.Sole;
import com.example.hyperstyle.infrastructure.cloudinary.CloudinaryResult;
import com.example.hyperstyle.infrastructure.cloudinary.UploadImageToCloudinary;
import com.example.hyperstyle.infrastructure.constant.Status;
import com.example.hyperstyle.infrastructure.exception.rest.RestApiException;
import com.example.hyperstyle.repository.BrandRepository;
import com.example.hyperstyle.repository.CategoryRepository;
import com.example.hyperstyle.repository.ImageRepository;
import com.example.hyperstyle.repository.MaterialRepository;
import com.example.hyperstyle.repository.ProductRepository;
import com.example.hyperstyle.repository.SoleRepository;
import com.example.hyperstyle.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private SoleRepository soleRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private UploadImageToCloudinary uploadImage;

    @Override
    public List<ProductResponse> getAllProduct(GetProductRequest request) {
        return productRepository.getAll(request);
    }

    @Override
    public Product getOneById(String id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new RestApiException("Product khong ton tai"));
        return product;
    }

    @Override
    @Transactional
    public ReturnCreateProduct create(@Valid CreateProductRequest request,
                                      List<ImageRequest> listImageRequest)
            throws ExecutionException, InterruptedException {

        if (productRepository.existsByCode(request.getCode())) {
            throw new RestApiException("Mã sản phẩm " + request.getCode() + " đã tồn tại !!");
        }

        if (productRepository.existsByName(request.getName())) {
            throw new RestApiException("Tên sản phẩm đã tồn tại");
        }

        Brand brand = brandRepository.findById(request.getBrandId()) // dòng 84
                .orElseThrow(() -> new RestApiException("Brand không tồn tại: " + request.getBrandId()));

        Material material = materialRepository.findById(request.getMaterialId())
                .orElseThrow(() -> new RestApiException("Material không tồn tại: " + request.getMaterialId()));

        Sole sole = soleRepository.findById(request.getSoleId())
                .orElseThrow(() -> new RestApiException("Sole không tồn tại: " + request.getSoleId()));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RestApiException("Category không tồn tại: " + request.getCategoryId()));

        CompletableFuture<List<CloudinaryResult>> uploadFuture = uploadImage.uploadImagesAsync(listImageRequest);

        Product product = new Product();
        product.setCode(request.getCode());
        product.setName(request.getName());
        product.setStatus(request.getStatus() != null ? request.getStatus() : Status.DANG_SU_DUNG);
        product.setBrand(brand);
        product.setMaterial(material);
        product.setSole(sole);
        product.setCategory(category);

        Product savedProduct = productRepository.save(product); // Có ID ở đây

        List<CloudinaryResult> listUrl = uploadFuture.get(); // Chờ upload xong

        List<Image> images = listUrl.stream()
                .map(result -> {
                    Image image = new Image();
                    image.setProduct(savedProduct);
                    image.setUrl(result.getUrl());
                    image.setStatus(true);
                    return image;
                })
                .collect(Collectors.toList());

        imageRepository.saveAll(images);

        return new ReturnCreateProduct(savedProduct);
    }

    @Override
    public Product update(UpdateProductRequest request, List<ImageRequest> images) {
        Product productToUpdate = productRepository.findById(request.getId())
                .orElseThrow(() -> new RestApiException("Sản phẩm không tồn tại!"));

        Product duplicateCheck = productRepository.getOneByName(request.getName());

        if (duplicateCheck != null && !duplicateCheck.getId().equals(request.getId())) {
            throw new RestApiException("Tên sản phẩm đã tồn tại!");
        }

        productToUpdate.setName(request.getName());
        productToUpdate.setStatus(request.getStatus());
        productToUpdate.setCode(request.getCode());

        if (images != null && !images.isEmpty()) {
        }

        return productRepository.save(productToUpdate);
    }

    @Override
    public boolean delete(String id) {
        Product delete = productRepository.findById(id)
                .orElseThrow(() -> new RestApiException("Product Không Tồn Tại"));
        productRepository.delete(delete);
        return true;
    }

    @Override
    public List<String> getAllByName(String name) {
        return productRepository.getAllByName(name);
    }
}
