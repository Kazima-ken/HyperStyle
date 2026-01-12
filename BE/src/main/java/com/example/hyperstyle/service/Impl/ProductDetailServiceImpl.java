package com.example.hyperstyle.service.Impl;

import com.example.hyperstyle.dto.request.AttributeDTO;
import com.example.hyperstyle.dto.request.VariantDTO;
import com.example.hyperstyle.dto.request.productDetail.ProductDetailRequest;
import com.example.hyperstyle.dto.request.productDetail.GetProductDetailRequest;
import com.example.hyperstyle.dto.request.productDetail.UpdateProductDetailRequest;
import com.example.hyperstyle.dto.request.productDetail.UpdateQuantityAndPrice;
import com.example.hyperstyle.dto.response.productdetail.GetByProduct;
import com.example.hyperstyle.dto.response.productdetail.GetByProductDetail;
import com.example.hyperstyle.dto.response.productdetail.ProductDetailCustomerResponse;
import com.example.hyperstyle.dto.response.productdetail.ProductDetailResponse;
import com.example.hyperstyle.entity.Color;
import com.example.hyperstyle.entity.Image;
import com.example.hyperstyle.entity.Product;
import com.example.hyperstyle.entity.ProductDetail;
import com.example.hyperstyle.entity.Size;
import com.example.hyperstyle.infrastructure.constant.Status;
import com.example.hyperstyle.infrastructure.exception.rest.RestApiException;
import com.example.hyperstyle.repository.ColorRepository;
import com.example.hyperstyle.repository.ImageRepository;
import com.example.hyperstyle.repository.ProductDetailRepository;
import com.example.hyperstyle.repository.ProductRepository;
import com.example.hyperstyle.repository.SizeRepository;
import com.example.hyperstyle.service.ProductDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductDetailServiceImpl implements ProductDetailService {

    private final ProductDetailRepository productDetailRepository;
    private final ProductRepository productRepository;
    private final SizeRepository sizeRepository;
    private final ColorRepository colorRepository;
    @Autowired
    private ImageRepository imageRepository;

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
    public ProductDetail update(String id, UpdateProductDetailRequest request) {
        ProductDetail existingDetail = productDetailRepository.findById(id)
                .orElseThrow(() -> new RestApiException("Chi tiết sản phẩm không tìm thấy với ID: " + id));

        Size size = sizeRepository.findById(request.getSizeId())
                .orElseThrow(() -> new RestApiException("Size không tồn tại"));

        Color color = colorRepository.findById(request.getColorId())
                .orElseThrow(() -> new RestApiException("Màu sắc không tồn tại"));

        boolean isDuplicate = productDetailRepository.existsByProductIdAndSizeIdAndColorIdAndIdNot(
                request.getId(),
                request.getSizeId(),
                request.getColorId(),
                id
        );

        if (isDuplicate) {
            throw new RestApiException("Không thể cập nhật! Biến thể (Sản phẩm + Size + Màu) này đã tồn tại ở một dòng khác.");
        }

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
    public List<GetByProduct> getOneByIdProduct(String id) {
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

    @Override
    public GetByProductDetail getOneByIdProductDetail(String id) {
        return productDetailRepository.getByIdProductDetail(id).orElse(null);
    }

    @Override
    public ProductDetailCustomerResponse getProductDetailClient(String productId) {
        // BƯỚC 1: Lấy tất cả biến thể của sản phẩm cha
        List<ProductDetail> listVariants = productDetailRepository.getAllByProductId(productId);

        if (listVariants.isEmpty()) {
            throw new RuntimeException("Sản phẩm không tồn tại hoặc ngừng kinh doanh!");
        }

        // Lấy thông tin chung từ phần tử đầu tiên (vì chung cha nên giống nhau)
        Product product = listVariants.get(0).getProduct();

        // BƯỚC 2: Xử lý danh sách MÀU SẮC (Distinct - Duy nhất)
        // Logic: Lấy list màu -> Lọc trùng lặp dựa trên ID màu
        List<AttributeDTO> listColors = listVariants.stream()
                .map(pd -> pd.getColor())
                .filter(Objects::nonNull) // Bỏ qua nếu null
                // Sử dụng Map để lọc trùng theo Key là ID
                .collect(Collectors.collectingAndThen(
                        Collectors.toMap(
                                color -> color.getId(), // Key là ID
                                color -> new AttributeDTO(color.getId(), color.getName(), color.getCode()), // Value là DTO
                                (existing, replacement) -> existing // Nếu trùng key thì giữ cái cũ
                        ),
                        map -> new ArrayList<>(map.values())
                ));

        // BƯỚC 3: Xử lý danh sách KÍCH THƯỚC (Distinct & Sort)
        List<AttributeDTO> listSizes = listVariants.stream()
                .map(pd -> pd.getSize())
                .filter(Objects::nonNull)
                .collect(Collectors.collectingAndThen(
                        Collectors.toMap(
                                size -> size.getId(),
                                size -> new AttributeDTO(size.getId(), size.getName(), null),
                                (existing, replacement) -> existing
                        ),
                        map -> new ArrayList<>(map.values())
                ));

        // Sắp xếp size (Ví dụ: theo tên size 38, 39, 40...)
        listSizes.sort(Comparator.comparing(AttributeDTO::getName));

        // BƯỚC 4: Tạo danh sách VariantDTO (Đây là bản đồ để Frontend tra cứu)
        List<VariantDTO> listVariantDTOs = listVariants.stream()
                .map(pd -> new VariantDTO(
                        pd.getId(), // ID Product Detail (quan trọng nhất)
                        pd.getColor() != null ? pd.getColor().getId() : "",
                        pd.getSize() != null ? pd.getSize().getId() : "",
                        pd.getPrice(),
                        pd.getQuantity()
                ))
                .collect(Collectors.toList());

        // BƯỚC 5: Lấy ảnh
        List<Image> images = imageRepository.getAllByProduct(productId);
        String imageString = images.stream()
                .map(Image::getUrl)
                .collect(Collectors.joining(","));

        // BƯỚC 6: Map dữ liệu vào Response
        ProductDetailCustomerResponse response = new ProductDetailCustomerResponse();

        // Info Product
        response.setIdProduct(product.getId());
        response.setNameProduct(product.getName());
        response.setCodeProduct(product.getCode());

        // Info Brand/Category... (Check null an toàn)
        response.setNameBrand(product.getBrand() != null ? product.getBrand().getName() : "Unknown");
        response.setNameCategory(product.getCategory() != null ? product.getCategory().getName() : "Unknown");
        response.setNameMaterial(product.getMaterial() != null ? product.getMaterial().getName() : "Unknown");
        response.setNameSole(product.getSole() != null ? product.getSole().getName() : "Unknown");

        // Data hiển thị
        response.setImage(imageString);
        // Lấy giá thấp nhất hoặc giá của phần tử đầu tiên làm giá hiển thị
        response.setPriceDefault(listVariants.get(0).getPrice());

        // Data logic chọn
        response.setListColors(listColors);
        response.setListSizes(listSizes);
        response.setListVariants(listVariantDTOs);

        return response;
    }



}
