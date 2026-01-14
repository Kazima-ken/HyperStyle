package com.example.hyperstyle.dto.response.address;

import com.example.hyperstyle.entity.Address;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

@Projection(types = {Address.class})
public interface AddressResponse {

    @Value("#{target.stt}")
    Integer getSTT();

    @Value("#{target.id}")
    String getId();

    @Value("#{target.line}")
    String getLine();

    @Value("#{target.district}")
    String getDistrict();

    @Value("#{target.province}")
    String getProvince();

    @Value("#{target.ward}")
    String getWard();

    @Value("#{target.status}")
    String getStatus();

    // Hai trường này phải khớp tên với AS trong câu SQL
    @Value("#{target.fullName}")
    String getFullName();

    @Value("#{target.phoneNumber}")
    String getPhoneNumber();

    @Value("#{target.districtId}")
    Integer getDistrictId();

    @Value("#{target.wardCode}")
    String getWardCode();

    @Value("#{target.idUser}")
    String getIdUser(); // Thêm để khớp với SQL
}
