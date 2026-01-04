package com.example.hyperstyle.service.Impl;

import com.example.hyperstyle.dto.request.productDetail.ProductDetailRequest;
import com.example.hyperstyle.dto.request.productDetail.GetProductDetailRequest;
import com.example.hyperstyle.dto.request.productDetail.UpdateQuantityAndPrice;
import com.example.hyperstyle.dto.response.productdetail.GetByProduct;
import com.example.hyperstyle.dto.response.productdetail.ProductDetailResponse;
import com.example.hyperstyle.entity.Color;
import com.example.hyperstyle.entity.Product;
import com.example.hyperstyle.entity.ProductDetail;
import com.example.hyperstyle.entity.Size;
import com.example.hyperstyle.infrastructure.constant.Status;
import com.example.hyperstyle.infrastructure.exception.rest.RestApiException;
import com.example.hyperstyle.repository.ColorRepository;
import com.example.hyperstyle.repository.ProductDetailRepository;
import com.example.hyperstyle.repository.ProductRepository;
import com.example.hyperstyle.repository.SizeRepository;
import com.example.hyperstyle.service.ProductDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductDetailServiceImpl implements ProductDetailService {

    private final ProductDetailRepository productDetailRepository;
    private final ProductRepository productRepository;
    private final SizeRepository sizeRepository;
    private final ColorRepository colorRepository;

    @Override
    public List<ProductDetailResponse> getAllActive(GetProductDetailRequest request) {
        return productDetailRepository.getAll(request);
    }

    @Override
    @Transactional
    public ProductDetail create(ProductDetailRequest request) {
        // 1. Validate các ID khóa ngoại
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RestApiException("Sản phẩm không tồn tại: " + request.getProductId()));

        Size size = sizeRepository.findById(request.getSizeId())
                .orElseThrow(() -> new RestApiException("Kích cỡ không tồn tại: " + request.getSizeId()));

        Color color = colorRepository.findById(request.getColorId())
                .orElseThrow(() -> new RestApiException("Màu sắc không tồn tại: " + request.getColorId()));

        // 2. CHECK TRÙNG LẶP (Quan trọng)
        if (productDetailRepository.existsByProductIdAndSizeIdAndColorId(
                request.getProductId(), request.getSizeId(), request.getColorId())) {
            throw new RestApiException("Biến thể này đã tồn tại (Sản phẩm + Size + Màu này đã có)!");
        }

        // 3. Tạo mới Entity
        ProductDetail productDetail = new ProductDetail();
        productDetail.setProduct(product);
        productDetail.setSize(size);
        productDetail.setColor(color);

        // Map các trường thông tin
        productDetail.setDescription(request.getDescription());
        productDetail.setGender(request.getGender());
        productDetail.setQuantity(request.getQuantity());
        productDetail.setPrice(request.getPrice());
        productDetail.setStatus(request.getStatus());

        return productDetailRepository.save(productDetail);
    }

    @Override
    @Transactional
    public ProductDetail update(String id, ProductDetailRequest request) {
        // 1. Tìm bản ghi cũ
        ProductDetail existingDetail = productDetailRepository.findById(id)
                .orElseThrow(() -> new RestApiException("Chi tiết sản phẩm không tìm thấy với ID: " + id));

        // 2. Validate và Set lại khóa ngoại (nếu có thay đổi)
        // Lưu ý: Request gửi lên là ID, ta cần tìm Object tương ứng

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RestApiException("Sản phẩm không tồn tại"));

        Size size = sizeRepository.findById(request.getSizeId())
                .orElseThrow(() -> new RestApiException("Size không tồn tại"));

        Color color = colorRepository.findById(request.getColorId())
                .orElseThrow(() -> new RestApiException("Màu sắc không tồn tại"));

        // 3. CHECK TRÙNG LẶP KHI UPDATE
        // Logic: Nếu ta đổi Size/Màu thành A/B, phải chắc chắn rằng chưa có thằng nào khác đang là A/B
        boolean isDuplicate = productDetailRepository.existsByProductIdAndSizeIdAndColorIdAndIdNot(
                request.getProductId(),
                request.getSizeId(),
                request.getColorId(),
                id // Loại trừ chính bản ghi hiện tại
        );

        if (isDuplicate) {
            throw new RestApiException("Không thể cập nhật! Biến thể (Sản phẩm + Size + Màu) này đã tồn tại ở một dòng khác.");
        }

        existingDetail.setProduct(product);
        existingDetail.setSize(size);
        existingDetail.setColor(color);

        existingDetail.setDescription(request.getDescription());
        existingDetail.setGender(request.getGender());
        existingDetail.setQuantity(request.getQuantity());
        existingDetail.setPrice(request.getPrice());
        existingDetail.setStatus(request.getStatus());

        return productDetailRepository.save(existingDetail);
    }

    @Override
    public List<GetByProduct> getOneById(String id) {
        return productDetailRepository.getByIdProduct(id);
    }

    public boolean delete(String id) {
        productDetailRepository.deleteById(id);
        return true;
    }

    @Override
    public List<UpdateQuantityAndPrice> updateList(List<UpdateQuantityAndPrice> requestData) {
        List<ProductDetail> detailList = new ArrayList<>();
        requestData.stream().forEach(a -> {
            Optional<ProductDetail> detailOptional = productDetailRepository.findById(a.getId());
            System.out.println(detailOptional.get().getId());
            if (!detailOptional.isPresent()) {
                throw new RestApiException("Chi Tiết Sản Phẩm Không Tồn Tại");
            }
            ProductDetail detail = detailOptional.get();
            detail.setPrice(a.getPrice());
            detail.setQuantity(a.getQuantity());
            detail.setStatus(Status.DANG_SU_DUNG);
            detailList.add(detail);
        });
        productDetailRepository.saveAll(detailList);
        return requestData;
    }
}
