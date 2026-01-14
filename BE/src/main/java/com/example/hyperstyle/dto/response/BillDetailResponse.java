package com.example.hyperstyle.dto.response;

import com.example.hyperstyle.entity.Bill;
import com.example.hyperstyle.entity.BillDetail;
import com.example.hyperstyle.entity.Product;
import com.example.hyperstyle.entity.ProductDetail;
import com.example.hyperstyle.entity.Size;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.math.BigDecimal;

public interface BillDetailResponse {
    String getStt();

    String getIdBill();      // Khớp với AS idBill

    String getIdProduct();   // Khớp với AS idProduct

    String getId();

    String getImage();

    String getCodeProduct(); // Khớp với AS codeProduct

    String getProductName(); // Khớp với AS productName

    String getNameColor();   // Khớp với AS nameColor

    String getNameSize();    // Khớp với AS nameSize

    String getNameSole();

    String getNameMaterial();

    String getNameCategory();

    BigDecimal getPrice();

    Integer getQuantity();

    Integer getMaxQuantity(); // Khớp với AS maxQuantity

    String getStatus();

    String getCodeColor();
}
