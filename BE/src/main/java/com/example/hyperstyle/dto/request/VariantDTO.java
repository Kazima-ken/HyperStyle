package com.example.hyperstyle.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VariantDTO {
    private String idProductDetail; // ID quan trọng để thêm vào giỏ hàng
    private String idColor;
    private String idSize;
    private BigDecimal price;
    private Integer quantity;
}
