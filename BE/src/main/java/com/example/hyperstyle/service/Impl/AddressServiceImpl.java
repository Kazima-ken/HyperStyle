package com.example.hyperstyle.service.Impl;

import com.example.hyperstyle.dto.request.address.CreateAddressRequest;
import com.example.hyperstyle.dto.request.address.FindAddressRequest;
import com.example.hyperstyle.dto.response.address.AddressResponse;
import com.example.hyperstyle.dto.response.address.AddressUserReponse;
import com.example.hyperstyle.dto.response.staff.StaffFullResponse;
import com.example.hyperstyle.entity.Address;
import com.example.hyperstyle.entity.User;
import com.example.hyperstyle.infrastructure.constant.Status;
import com.example.hyperstyle.infrastructure.exception.rest.RestApiException;
import com.example.hyperstyle.repository.AddressRepository;
import com.example.hyperstyle.repository.UserRepository;
import com.example.hyperstyle.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AddressServiceImpl implements AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<AddressResponse> getList(FindAddressRequest request) {
        return addressRepository.getAll(request);
    }

    @Override
    public List<AddressUserReponse> getAddressByUserId(String idUser) {
        return addressRepository.getAddressByUserId(idUser);
    }

    @Override
    public Address create(CreateAddressRequest req) {
        List<Address> checkStatusAddress = addressRepository.getAllAddressByStatus(Status.DANG_SU_DUNG, req.getUserId());
        Optional<User> user = userRepository.findById(req.getUserId());
        System.out.println(checkStatusAddress);
        if (checkStatusAddress.isEmpty()) {
            Address address = Address.builder().line(req.getLine()).district(req.getDistrict()).province(req.getProvince())
                    .ward(req.getWard()).status(Status.DANG_SU_DUNG).provinceId(req.getProvinceId()).districtId(req.getDistrictId())
                    .wardCode(req.getWardCode()).fullName(req.getFullName()).phoneNumber(req.getPhoneNumber()).user(user.get()).build();
            return addressRepository.save(address);
        } else {
            Address address = Address.builder().line(req.getLine()).district(req.getDistrict()).province(req.getProvince())
                    .ward(req.getWard()).status(Status.KHONG_SU_DUNG).provinceId(req.getProvinceId()).districtId(req.getDistrictId())
                    .wardCode(req.getWardCode()).fullName(req.getFullName()).phoneNumber(req.getPhoneNumber()).user(user.get()).build();
            return addressRepository.save(address);
        }

    }

    @Override
    public Address getAddressByUserIdAndStatus(String id, Status status) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RestApiException("User không tồn tại"));

        Address address = addressRepository.getAddressByUserIdAndStatus(user.getId(), status);

        if (address == null) {
            throw new RestApiException("Không có địa chỉ mặc định");
        }

        return address;
    }

}
