package com.example.hyperstyle.dto.request.address;

import com.example.hyperstyle.infrastructure.constant.Status;
import jakarta.validation.constraints.NotBlank;

public class CreateAddressRequest {

    @NotBlank(message = "Vui Lòng Không Để Trống Tên Đường")
    private String line;

    @NotBlank(message = "Vui Lòng Không Để Trống Tên Quận, Huyện")
    private String district;

    @NotBlank(message = "Vui Lòng Không Để Trống Tên Tỉnh, Thành Phố")
    private String province;

    @NotBlank(message = "Vui Lòng Không Để Trống Tên Xã")
    private String ward;

    private Integer provinceId;

    private Integer toDistrictId;

    private String wardCode;

    private Status status;

    private String userId;

    @NotBlank(message = "Vui Lòng Không Để Trống Tên ")
    private String fullName;

    @NotBlank(message = "Vui Lòng Không Để Trống Số Điện Thoại")
    private String phoneNumber;

}
