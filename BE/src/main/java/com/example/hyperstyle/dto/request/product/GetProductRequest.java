package com.example.hyperstyle.dto.request.product;

import com.example.hyperstyle.infrastructure.common.PageableRequest;
import com.example.hyperstyle.infrastructure.constant.Status;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GetProductRequest extends PageableRequest {

    private String keyword;

    private String status;

    private Integer minQuantity;

    private Integer maxQuantity;


}
