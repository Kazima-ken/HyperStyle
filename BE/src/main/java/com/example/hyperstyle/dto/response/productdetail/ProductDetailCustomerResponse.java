package com.example.hyperstyle.dto.response.productdetail;

import com.example.hyperstyle.dto.request.AttributeDTO;
import com.example.hyperstyle.dto.request.VariantDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
public class ProductDetailCustomerResponse {
    // Thông tin sản phẩm cha
    private String idProduct;
    private String nameProduct;
    private String codeProduct;
    private String description;

    // Thông tin bổ sung
    private String nameBrand;
    private String nameCategory;
    private String nameMaterial;
    private String nameSole;

    // Ảnh và giá hiển thị
    private String image; // Chuỗi các url ảnh
    private BigDecimal priceDefault; // Giá hiển thị ban đầu

    // --- QUAN TRỌNG: Dữ liệu để render giao diện chọn ---
    private List<AttributeDTO> listColors;   // List màu (unique)
    private List<AttributeDTO> listSizes;    // List size (unique)
    private List<VariantDTO> listVariants;   // List toàn bộ biến thể để tra cứu
}
