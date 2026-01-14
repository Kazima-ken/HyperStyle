package com.example.hyperstyle.service.Impl;

import com.example.hyperstyle.dto.request.account.CreateAccountRequest;
import com.example.hyperstyle.dto.request.account.CreateStaffFullRequest;
import com.example.hyperstyle.dto.request.account.UpdateAccountRequest;
import com.example.hyperstyle.dto.request.account.UpdateStaffFullRequest;
import com.example.hyperstyle.dto.request.account.UpdateStaffRequest2;
import com.example.hyperstyle.dto.request.address.CreateAddressRequest;
import com.example.hyperstyle.dto.request.address.UpdateAddressRequest;
import com.example.hyperstyle.dto.request.staff.CreateStaffRequest;
import com.example.hyperstyle.dto.request.staff.FindStaffRequest;
import com.example.hyperstyle.dto.request.staff.UpdateStaffRequest;
import com.example.hyperstyle.dto.response.staff.StaffFullResponse;
import com.example.hyperstyle.dto.response.staff.StaffReduceResponse;
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
import com.example.hyperstyle.repository.UserRepository;
import com.example.hyperstyle.service.StaffService;
import com.example.hyperstyle.util.ResponseObject;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class StaffServiceImpl implements StaffService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final AddressRepository addressRepository;
    private final PasswordEncoder passwordEncoder;
    private final UploadImageToCloudinary imageToCloudinary;

    @Override
    public List<StaffFullResponse> getAll(FindStaffRequest request) {
        return userRepository.getAll(request);
    }

    @Override
    public List<StaffFullResponse> searchDate(FindStaffRequest req) {
        return null;
    }

    @Override
    public void createStaff(CreateStaffFullRequest request, MultipartFile avatar) {

        String avatarUrl = null;

        if (avatar != null && !avatar.isEmpty()) {
            try {
                avatarUrl = imageToCloudinary.uploadImage(avatar);
            } catch (IOException e) {
                throw new RuntimeException("Upload avatar thất bại");
            }
        }

        User user = User.builder()
                .fullName(request.getStaff().getFullName())
                .dateOfBirth(request.getStaff().getDateOfBirth())
                .phoneNumber(request.getStaff().getPhoneNumber())
                .email(request.getStaff().getEmail())
                .gender(request.getStaff().getGender())
                .citizenIdentity(request.getStaff().getCitizenIdentity())
                .avata(avatarUrl)
                .status(Status.DANG_SU_DUNG)
                .build();

        userRepository.save(user);

        Account account = Account.builder()
                .email(request.getAccount().getEmail())
                .password(passwordEncoder.encode(request.getAccount().getPassword()))
                .roles(request.getAccount().getRoles())
                .status(Status.DANG_SU_DUNG)
                .user(user)
                .build();

        accountRepository.save(account);

        Address address = Address.builder()
                .user(user)
                .line(request.getAddress().getLine())
                .province(request.getAddress().getProvince())
                .district(request.getAddress().getDistrict())
                .ward(request.getAddress().getWard())
                .wardCode(request.getAddress().getWardCode())
                .provinceId(request.getAddress().getProvinceId())
                .districtId(request.getAddress().getDistrictId())
                .fullName(request.getAddress().getFullName())
                .phoneNumber(request.getAddress().getPhoneNumber())
                .status(Status.DANG_SU_DUNG)
                .build();

        addressRepository.save(address);
    }

    @Override
    @Transactional // Đảm bảo tính toàn vẹn dữ liệu (rollback nếu lỗi)
    public ResponseObject<?> updateStaff(String id, UpdateStaffFullRequest request, MultipartFile file) {

        // 1. Tìm User
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với ID: " + id));

        // 2. Xử lý ảnh (Avatar)
        if (file != null && !file.isEmpty()) {
            try {
                // Upload ảnh mới lên Cloudinary
                String avatarUrl = imageToCloudinary.uploadImage(file);
                user.setAvata(avatarUrl);
            } catch (IOException e) {
                throw new RuntimeException("Lỗi khi upload ảnh");
            }
        }

        UpdateStaffRequest2 staffReq = request.getStaff();
        user.setFullName(staffReq.getFullName());
        user.setDateOfBirth(staffReq.getDateOfBirth());
        user.setPhoneNumber(staffReq.getPhoneNumber());
        user.setEmail(staffReq.getEmail());
        user.setGender(staffReq.getGender());
        user.setCitizenIdentity(staffReq.getCitizenIdentity());
        user.setStatus(staffReq.getStatus());

        userRepository.save(user);

        Address address = addressRepository.findByUserId(id)
                .orElse(new Address());

        UpdateAddressRequest addrReq = request.getAddress();
        address.setUser(user); // Map lại cho chắc
        address.setLine(addrReq.getLine());
        address.setProvinceId(addrReq.getProvinceId());
        address.setDistrictId(addrReq.getDistrictId());
        address.setWardCode(addrReq.getWardCode());

        // Lưu tên địa chính (Frontend gửi lên hoặc Backend tự query lại từ ID)
        address.setProvince(addrReq.getProvince());
        address.setDistrict(addrReq.getDistrict());
        address.setWard(addrReq.getWard());

        // Thông tin người nhận hàng (thường lấy theo user)
        address.setFullName(user.getFullName());
        address.setPhoneNumber(user.getPhoneNumber());

        addressRepository.save(address);

        // 5. Cập nhật Account
        Account account = accountRepository.findByUserId(id)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));

        UpdateAccountRequest accReq = request.getAccount();

        // Lưu ý: Chỉ cập nhật password nếu frontend có gửi giá trị mới
        // Do DTO bạn để @NotBlank password nên bắt buộc frontend phải gửi.
        // Nếu logic update không đổi pass thì DTO Account nên bỏ @NotBlank.
        if (accReq.getPassword() != null && !accReq.getPassword().isEmpty()) {
            account.setPassword(passwordEncoder.encode(accReq.getPassword()));
        }

        account.setRoles(accReq.getRoles());
        account.setStatus(staffReq.getStatus()); // Đồng bộ status với User

        accountRepository.save(account);

        return ResponseObject.success("Cập nhật nhân viên thành công");
    }

    @Override
    public Boolean delete(String id) {
        return null;
    }

    @Override
    public StaffFullResponse getOneById(String id) {
        Optional<StaffFullResponse> optional = userRepository.getOneWithId(id);
        if (!optional.isPresent()) {
            throw new RestApiException("Staff Không Tồn Tại");
        }
        return optional.get();
    }
}
