package com.example.hyperstyle.service.Impl;

import com.example.hyperstyle.dto.request.address.CreateAddressRequest;
import com.example.hyperstyle.dto.request.address.UpdateAddressRequest;
import com.example.hyperstyle.dto.request.customer.CreateCustomerRequest;
import com.example.hyperstyle.dto.request.customer.FindCustomerRequest;
import com.example.hyperstyle.dto.request.customer.UpdateByUserClient;
import com.example.hyperstyle.dto.request.customer.UpdateCustomerRequest;
import com.example.hyperstyle.dto.request.image.ImageRequest;
import com.example.hyperstyle.dto.request.staff.FindStaffRequest;
import com.example.hyperstyle.dto.response.user.UserResponse;
import com.example.hyperstyle.entity.Account;
import com.example.hyperstyle.entity.Address;
import com.example.hyperstyle.entity.User;
import com.example.hyperstyle.infrastructure.cloudinary.UploadImageToCloudinary;
import com.example.hyperstyle.infrastructure.constant.Message;
import com.example.hyperstyle.infrastructure.constant.Status;
import com.example.hyperstyle.infrastructure.exception.rest.RestApiException;
import com.example.hyperstyle.repository.AccountRepository;
import com.example.hyperstyle.repository.AddressRepository;
import com.example.hyperstyle.repository.CustomerRepository;
import com.example.hyperstyle.repository.UserReposiory;
import com.example.hyperstyle.repository.UserRepository;
import com.example.hyperstyle.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    private final UserRepository userRepository;

    private final UploadImageToCloudinary imageToCloudinary;

    private final AddressRepository addressRepository;

    private final AccountRepository accountRepository;

    @Override
    public List<UserResponse> findAll(FindCustomerRequest request) {
        String keyword = (request.getKeyword() != null) ? request.getKeyword().trim() : null;

        Status status = null;
        if (request.getStatus() != null && !request.getStatus().isEmpty()) {
            try {
                status = Status.valueOf(request.getStatus());
            } catch (IllegalArgumentException e) {
                status = null;
            }
        }

        List<Account> accounts = customerRepository.findAllCustomers(keyword, status);

        AtomicInteger index = new AtomicInteger(1); // Biến đếm STT

        return accounts.stream()
                .filter(account -> account.getUser() != null) // Đảm bảo không bị lỗi NullPointer
                .map(account -> {
                    User user = account.getUser();

                    // Trả về một implementation ẩn danh của UserResponse
                    return new UserResponse() {
                        @Override
                        public Integer getSTT() {
                            return index.getAndIncrement();
                        }

                        @Override
                        public String getId() {
                            return user.getId();
                        }

                        @Override
                        public String getEmail() {
                            // Ưu tiên lấy email đăng nhập từ Account
                            return account.getEmail();
                        }

                        @Override
                        public String getAvata() {
                            return user.getAvata();
                        }

                        @Override
                        public String getPhoneNumber() {
                            return user.getPhoneNumber();
                        }

                        @Override
                        public String getStatus() {
                            return account.getStatus() != null ? account.getStatus().name() : null;
                        }

                        @Override
                        public Date getDateOfBirth() {
                            return user.getDateOfBirth();
                        }

                        @Override
                        public String getFullName() {
                            return user.getFullName();
                        }

                        @Override
                        public String getPassword() {
                            return account.getPassword();
                        }

                        @Override
                        public Boolean getGender() {
                            return user.getGender();
                        }

                        @Override
                        public String getIdAccount() {
                            return account.getId();
                        }

                        @Override
                        public String getCitizenIdentity() {
                            return user.getCitizenIdentity();
                        }
                    };
                })
                .collect(Collectors.toList());
    }

    @Override
    public User create(CreateCustomerRequest request, CreateAddressRequest addressRequest, MultipartFile file) {
        return null;
    }

    @Override
    @Transactional
    public User update(UpdateCustomerRequest request,
                       UpdateAddressRequest addressRequest,
                       MultipartFile file) {

        User user = userRepository.findById(request.getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng: " + request.getId()));

        Account account = accountRepository.findByUserId(user.getId())
                .orElse(null);

        if (!user.getPhoneNumber().equals(request.getPhoneNumber())) {
            if (userRepository.existsUserByPhone(request.getPhoneNumber())) {
                throw new RuntimeException("Số điện thoại đã được sử dụng!");
            }
            user.setPhoneNumber(request.getPhoneNumber());
        }

        if (!user.getEmail().equals(request.getEmail())) {
            if (userRepository.existsUserByEmail(request.getEmail())) {
                throw new RuntimeException("Email đã tồn tại trong hệ thống!");
            }

            user.setEmail(request.getEmail());

            if (account != null) {
                account.setEmail(request.getEmail());
            }
        }

        user.setFullName(request.getFullName());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setGender(request.getGender());
        user.setCitizenIdentity(request.getCitizenIdentity());

        if (request.getStatus() != null) {
            user.setStatus(request.getStatus());
            if (account != null) {
                account.setStatus(request.getStatus());
            }
        }

        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            if (account != null) {
                account.setPassword(request.getPassword());
            }
        }

        if (file != null && !file.isEmpty()) {
            try {
                String url = imageToCloudinary.uploadImage(file);
                user.setAvata(url);
            } catch (IOException e) {
                throw new RuntimeException("Lỗi upload ảnh: " + e.getMessage());
            }
        }

        if (addressRequest != null) {
            handleUpdateAddress(user, addressRequest);
        }


        User updatedUser = userRepository.save(user);

        if (account != null) {
            accountRepository.save(account);
        }

        return updatedUser;
    }

    // Tách hàm xử lý địa chỉ cho gọn code
    private void handleUpdateAddress(User user, UpdateAddressRequest req) {
        // 1. Tìm tất cả các địa chỉ đang ACTIVE (DANG_SU_DUNG) của user này
        List<Address> activeAddresses = addressRepository.findByUserIdAndStatus(user.getId(), Status.DANG_SU_DUNG);

        Address addressToUpdate;

        if (activeAddresses.isEmpty()) {
            // Trường hợp 1: User chưa có địa chỉ mặc định nào -> Tạo mới hoàn toàn
            addressToUpdate = new Address();
            addressToUpdate.setUser(user);
            // Địa chỉ mới này dĩ nhiên sẽ là ĐANG_SU_DUNG
            addressToUpdate.setStatus(Status.DANG_SU_DUNG);
        } else {
            // Trường hợp 2: Tìm thấy địa chỉ đang dùng -> Lấy phần tử đầu tiên để update
            addressToUpdate = activeAddresses.get(0);

            // --- SELF-HEAL (Tự sửa lỗi dữ liệu) ---
            // Nếu DB đang bị lỗi (có > 1 cái active), ta giữ cái đầu tiên (index 0),
            // và tắt active của tất cả các cái thừa còn lại (từ index 1 trở đi).
            if (activeAddresses.size() > 1) {
                for (int i = 1; i < activeAddresses.size(); i++) {
                    Address duplicateAddr = activeAddresses.get(i);
                    duplicateAddr.setStatus(Status.KHONG_SU_DUNG);
                    addressRepository.save(duplicateAddr);
                }
            }
        }

        // 2. Mapping dữ liệu mới đè lên địa chỉ cũ
        // Lưu ý: Không set lại ID, chỉ set thông tin
        addressToUpdate.setFullName(req.getFullName());
        addressToUpdate.setPhoneNumber(req.getPhoneNumber());
        addressToUpdate.setLine(req.getLine());
        addressToUpdate.setProvince(req.getProvince());
        addressToUpdate.setDistrict(req.getDistrict());
        addressToUpdate.setWard(req.getWard());
        addressToUpdate.setProvinceId(req.getProvinceId());
        addressToUpdate.setDistrictId(req.getDistrictId());
        addressToUpdate.setWardCode(req.getWardCode());

        // Đảm bảo trạng thái vẫn là ĐANG_SU_DUNG
        addressToUpdate.setStatus(Status.DANG_SU_DUNG);

        // 3. Lưu lại
        addressRepository.save(addressToUpdate);
    }

    @Override
    public User updateInfoClient(UpdateByUserClient request) {
        return null;
    }

    @Override
    public Boolean delete(String id) {
        return null;
    }

    @Override
    public UserResponse getOneById(String id) {
        Optional<UserResponse> optional = userRepository.getOneWithPassword(id);
        if (!optional.isPresent()) {
            throw new RestApiException("Usre không tồn tại");
        }
        return optional.get();
    }

    @Override
    public UserResponse getOneByPhoneNumber(String phoneNumber) {
        return null;
    }

    @Override
    public User findByEmail(String email) {
        return null;
    }
}
