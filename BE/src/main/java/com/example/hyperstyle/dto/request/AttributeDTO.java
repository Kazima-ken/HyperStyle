package com.example.hyperstyle.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttributeDTO {
    private String id;
    private String name;
    private String value; // Dùng cho mã màu (codeColor), nếu là Size thì để null
}
