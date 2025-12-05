package com.example.hyperstyle.service.impl;

import com.example.hyperstyle.entity.*;
import com.example.hyperstyle.infrastructure.repository.*;
import com.example.hyperstyle.dto.request.ProductDetailRequest;
import com.example.hyperstyle.service.ProductDetailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;
import java.math.BigDecimal;

@Service
@Transactional
public class ProductDetailServiceImpl implements ProductDetailService {

    @Autowired
    private ProductDetailRepository productDetailRepository;

    @Autowired private ProductRepository productRepository;
    @Autowired private ColorRepository colorRepository;
    @Autowired private SizeRepository sizeRepository;

    @Override
    public Page<ProductDetail> getAllActive(Pageable pageable) {
        return productDetailRepository.findAll(pageable);
    }

    /**
     * Hàm Helper đơn giản để tìm và kiểm tra Entity dựa trên Optional
     */
    private <T> T findEntity(Optional<T> optionalEntity, String id, String entityName) {
        return optionalEntity.orElseThrow(
                () -> new RuntimeException("Lỗi: Không tìm thấy " + entityName + " với ID: " + id + ". Vui lòng kiểm tra ID trong Database.")
        );
    }

    /**
     * Tạo mới chi tiết sản phẩm (POST)
     */
    @Override
    public ProductDetail create(ProductDetailRequest request) {
        // Khởi tạo Entity trống
        ProductDetail productDetail = new ProductDetail();

        // 1. Thiết lập quan hệ khóa ngoại
        setForeignKeys(request, productDetail);

        // 2. Ánh xạ các trường dữ liệu cơ bản từ DTO sang Entity
        mapRequestToEntity(request, productDetail);

        // JPA sẽ tự động tạo và gán ID khi lưu
        return productDetailRepository.save(productDetail);
    }

    /**
     * Cập nhật chi tiết sản phẩm (PUT)
     */
    @Override
    public ProductDetail update(String id, ProductDetailRequest request) {
        // Tìm kiếm bản ghi hiện có
        ProductDetail existingDetail = productDetailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Chi tiết Sản phẩm cần cập nhật với ID: " + id));

        // 1. Thiết lập quan hệ khóa ngoại
        setForeignKeys(request, existingDetail);

        // 2. Ánh xạ các trường từ Request DTO
        mapRequestToEntity(request, existingDetail);

        return productDetailRepository.save(existingDetail);
    }

    // --- PRIVATE METHODS ---

    /**
     * Ánh xạ các trường dữ liệu cơ bản từ DTO sang Entity
     */
    private void mapRequestToEntity(ProductDetailRequest request, ProductDetail entity) {
        entity.setPrice(request.getPrice());
        entity.setQuantity(request.getQuantity());
        entity.setDescription(request.getDescription());
        entity.setGender(request.getGender());
        entity.setStatus(request.getStatus());
    }

    /**
     * Thiết lập các Entity khóa ngoại bằng cách tìm kiếm theo ID từ Request
     */
    private void setForeignKeys(ProductDetailRequest request, ProductDetail entity) {
        // Tìm kiếm Entity Product
        Product product = findEntity(productRepository.findById(request.getIdProduct()), request.getIdProduct(), "Sản phẩm");

        // Tìm kiếm Entity Color
        Color color = findEntity(colorRepository.findById(request.getIdColor()), request.getIdColor(), "Màu sắc");

        // Tìm kiếm Entity Size
        Size size = findEntity(sizeRepository.findById(request.getIdSize()), request.getIdSize(), "Kích cỡ");

        // Gán các Entity đã tìm được vào ProductDetail
        entity.setProduct(product);
        entity.setColor(color);
        entity.setSize(size);
    }
}