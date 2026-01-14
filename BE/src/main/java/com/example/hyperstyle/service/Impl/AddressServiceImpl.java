package com.example.hyperstyle.service.Impl;

import com.example.hyperstyle.dto.request.address.CreateAddressRequest;
import com.example.hyperstyle.dto.request.address.FindAddressRequest;
import com.example.hyperstyle.dto.request.address.UpdateAddressRequest;
import com.example.hyperstyle.dto.response.address.AddressResponse;
import com.example.hyperstyle.dto.response.address.AddressUserReponse;
import com.example.hyperstyle.dto.response.staff.StaffFullResponse;
import com.example.hyperstyle.entity.Account;
import com.example.hyperstyle.entity.Address;
import com.example.hyperstyle.entity.User;
import com.example.hyperstyle.infrastructure.constant.Status;
import com.example.hyperstyle.infrastructure.exception.rest.RestApiException;
import com.example.hyperstyle.repository.AccountRepository;
import com.example.hyperstyle.repository.AddressRepository;
import com.example.hyperstyle.repository.UserRepository;
import com.example.hyperstyle.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AddressServiceImpl implements AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountRepository accountRepository;

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
    @Transactional
    public Address createByAccount(CreateAddressRequest req) {
        Account account = accountRepository.findById(req.getUserId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản với ID: " + req.getUserId()));

        User user = account.getUser();

        if (user == null) {
            throw new RuntimeException("Tài khoản này chưa liên kết với thông tin người dùng (User is null)");
        }

        List<Address> checkStatusAddress = addressRepository.getAllAddressByStatus(Status.DANG_SU_DUNG, user.getId());

        // 4. Tạo Address
        Address.AddressBuilder addressBuilder = Address.builder()
                .line(req.getLine())
                .district(req.getDistrict())
                .province(req.getProvince())
                .ward(req.getWard())
                .provinceId(req.getProvinceId())
                .districtId(req.getDistrictId())
                .wardCode(req.getWardCode())
                .fullName(req.getFullName())
                .phoneNumber(req.getPhoneNumber())
                .user(user);

        if (checkStatusAddress.isEmpty()) {
            addressBuilder.status(Status.DANG_SU_DUNG);
        } else {
            addressBuilder.status(Status.KHONG_SU_DUNG); // Hoặc Status.THUONG tùy enum của bạn
        }

        return addressRepository.save(addressBuilder.build());
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

    @Override
    public Address getAddressByUserAccountAndStatus(String id, Status status) {

        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RestApiException("Account không tồn tại"));

        User user = userRepository.findById(account.getUser().getId())
                .orElseThrow(() -> new RestApiException("User không tồn tại"));

        Address address = addressRepository.getAddressByUserIdAndStatus(user.getId(), status);

        if (address == null) {
            throw new RestApiException("Không có địa chỉ mặc định");
        }

        return address;
    }

    @Override
    public List<AddressUserReponse> getAddressByAccountId(String id) {
        return addressRepository.getAddressByAccountId(id);
    }

    @Override
    public Address getOne(String id) {
        return addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy địa chỉ với ID: " + id));
    }

    @Override
    public Address update(String id, UpdateAddressRequest request) {
        // 1. Tìm địa chỉ cũ
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy địa chỉ"));

        // 2. Map dữ liệu từ Request sang Entity
        address.setFullName(request.getFullName());
        address.setPhoneNumber(request.getPhoneNumber());
        address.setLine(request.getLine());
        address.setProvince(request.getProvince());
        address.setDistrict(request.getDistrict());
        address.setWard(request.getWard());
        address.setProvinceId(request.getProvinceId());
        address.setDistrictId(request.getDistrictId());
        address.setWardCode(request.getWardCode());

        // 3. Xử lý Logic TRẠNG THÁI (Nếu chọn Mặc định -> Hủy mặc định cái cũ)
        if (request.getStatus() == Status.DANG_SU_DUNG) { // Giả sử DANG_SU_DUNG là Mặc định
            String userId = address.getUser().getId();

            // Tìm các địa chỉ đang active khác của user này
            List<Address> defaultAddresses = addressRepository.findAllByUserIdAndStatus(userId, Status.DANG_SU_DUNG);

            for (Address addr : defaultAddresses) {
                // Nếu không phải là địa chỉ đang sửa thì set về KHONG_SU_DUNG
                if (!addr.getId().equals(id)) {
                    addr.setStatus(Status.KHONG_SU_DUNG);
                    addressRepository.save(addr);
                }
            }
            address.setStatus(Status.DANG_SU_DUNG);
        } else {
            // Nếu không chọn mặc định
            address.setStatus(Status.KHONG_SU_DUNG);
        }

        // 4. Lưu và trả về
        return addressRepository.save(address);
    }

}
