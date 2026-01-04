package com.example.hyperstyle.service;

import com.example.hyperstyle.entity.ProductDetail;
import com.example.hyperstyle.infrastructure.constant.Status;
import com.example.hyperstyle.repository.ProductDetailRepository;
import com.example.hyperstyle.dto.request.ProductDetailRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductDetailService {

    private final ProductDetailRepository productDetailRepository;

    /* ===================== READ ===================== */

    // 1️⃣ Danh sách sản phẩm đang sử dụng (shop)
    public Page<ProductDetail> getAllActive(Pageable pageable) {
        return productDetailRepository
                .findAllByStatus(pageable, Status.DANG_SU_DUNG);
    }

    // 2️⃣ LẤY CHI TIẾT SẢN PHẨM (detail page)  ⭐ RẤT QUAN TRỌNG
    public ProductDetail getActiveById(String id) {
        return productDetailRepository
                .findDetailWithRelationsAndStatus(id, Status.DANG_SU_DUNG)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy sản phẩm hoặc đã ngừng bán")
                );
    }

    /* ===================== CREATE ===================== */

    public ProductDetail create(ProductDetailRequest req) {
        ProductDetail detail = ProductDetail.builder()
                .price(req.getPrice())
                .quantity(req.getQuantity())
                .status(Status.DANG_SU_DUNG)

                // ⚠️ Giả sử bạn đã map sẵn ở controller hoặc service khác
                // .product(product)
                // .color(color)
                // .size(size)

                .build();

        return productDetailRepository.save(detail);
    }

    /* ===================== UPDATE ===================== */

    public ProductDetail update(String id, ProductDetailRequest req) {
        ProductDetail detail = productDetailRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy chi tiết sản phẩm")
                );

        detail.setPrice(req.getPrice());
        detail.setQuantity(req.getQuantity());

        return productDetailRepository.save(detail);
    }

    /* ===================== DELETE (SOFT DELETE) ===================== */

    // ❗ KHÔNG nên xoá cứng – chỉ đổi trạng thái
    public void delete(String id) {
        ProductDetail detail = productDetailRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy chi tiết sản phẩm")
                );

        detail.setStatus(Status.KHONG_SU_DUNG);
        productDetailRepository.save(detail);
    }
}
