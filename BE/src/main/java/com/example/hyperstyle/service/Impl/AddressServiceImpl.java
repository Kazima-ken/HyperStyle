package com.example.hyperstyle.service.Impl;

import com.example.hyperstyle.dto.request.address.CreateAddressRequest;
import com.example.hyperstyle.dto.request.address.FindAddressRequest;
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
    @Transactional // Thêm cái này để đảm bảo load được User (do fetch = LAZY)
    public Address createByAccount(CreateAddressRequest req) {
        // 1. Tìm Account
        Account account = accountRepository.findById(req.getUserId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản với ID: " + req.getUserId()));

        // 2. Lấy User từ Account (SỬA LẠI: Lấy trực tiếp, không query)
        User user = account.getUser();

        // Kiểm tra kỹ an toàn dữ liệu
        if (user == null) {
            throw new RuntimeException("Tài khoản này chưa liên kết với thông tin người dùng (User is null)");
        }

        // 3. Kiểm tra địa chỉ mặc định
        // QUAN TRỌNG: Address gắn với User, nên phải dùng ID của User để check, KHÔNG dùng ID Account
        // Code cũ: ...getAllAddressByStatus(..., account.getId()) -> SAI
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
                .user(user); // Gán object User vào Address

        // 5. Logic set trạng thái (nếu chưa có địa chỉ nào -> Mặc định, ngược lại -> Thường)
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
}
