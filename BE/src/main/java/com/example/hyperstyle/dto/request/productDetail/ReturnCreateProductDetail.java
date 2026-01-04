package com.example.hyperstyle.dto.request.productDetail; // (Giả sử package)

import com.example.hyperstyle.entity.ProductDetail;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class ReturnCreateProductDetail {

    private String id;
    private String productName;  // Trả về tên cho dễ nhìn
    private String sizeName;     // Trả về tên size
    private String colorName;    // Trả về tên màu
    private String description;
    private String gender;
    private Integer quantity;
    private BigDecimal price;
    private String status;

    public ReturnCreateProductDetail(ProductDetail detail) {
        this.id = detail.getId();
        this.productName = detail.getProduct() != null ? detail.getProduct().getName() : null;
        this.sizeName = detail.getSize() != null ? detail.getSize().getName() : null; // Giả sử entity Size có getName()
        this.colorName = detail.getColor() != null ? detail.getColor().getName() : null; // Giả sử entity Color có getName()
        this.description = detail.getDescription();
        this.gender = detail.getGender() != null ? detail.getGender().name() : null;
        this.quantity = detail.getQuantity();
        this.price = detail.getPrice();
        this.status = detail.getStatus() != null ? detail.getStatus().name() : null;
    }
}