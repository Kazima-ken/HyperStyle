package com.example.hyperstyle.dto.request.productDetail;

import com.example.hyperstyle.infrastructure.common.PageableRequest;
import com.example.hyperstyle.infrastructure.constant.Gender;
import com.example.hyperstyle.infrastructure.constant.Status;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Data // Lombok sẽ tự tạo getter: getIdProduct(), getBrand(),...
public class GetProductDetailRequest extends PageableRequest {

    private String idProduct;

    private String color;
    private String brand;
    private String material;
    private String product;
    private String sole;
    private String category;

    private int size;

    private String status;
    private String gender;

    private BigDecimal minPrice;
    private BigDecimal maxPrice;
}
