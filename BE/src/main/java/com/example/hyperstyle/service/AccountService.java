package com.example.hyperstyle.service;

import com.example.hyperstyle.entity.Account;
import com.example.hyperstyle.entity.User;
import com.example.hyperstyle.infrastructure.constant.Role;
import com.example.hyperstyle.infrastructure.constant.Status;
import com.example.hyperstyle.dto.request.AccountRequest;
import com.example.hyperstyle.infrastructure.repository.AccountRepository;
import com.example.hyperstyle.infrastructure.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // READ: Lấy danh sách chung
    public List<Account> getAllByRole(Role role) {
        return accountRepository.findByRole(role);
    }

    // CREATE: Thêm mới (dùng chung cho NV và KH)
    @Transactional
    public Account createAccount(AccountRequest req, Role role) {

        // 1. Kiểm tra Email tồn tại
        if (accountRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã tồn tại!");
        }

        // 2. 🎯 FIX LỖI 500: Kiểm tra mật khẩu trước khi mã hóa
        String rawPassword = req.getPassword();
        if (rawPassword == null || rawPassword.trim().isEmpty()) {
            // Trường hợp này thường bị bắt bởi @NotBlank trong Controller.
            // Nhưng check an toàn trong Service là cần thiết.
            throw new IllegalArgumentException("Mật khẩu không được để trống.");
        }

        // 3. Tạo User Entity và map các trường từ Request
        User user = User.builder()
                .fullName(req.getFullName())
                .email(req.getEmail())
                // 🎯 Bổ sung mapping các trường User từ AccountRequest
                .phoneNumber(req.getPhoneNumber())
                .dateOfBirth(req.getDateOfBirth())
                .gender(req.getGender())
                .cccd(req.getCccd())
                .avata(req.getAvata())

                .status(Status.DANG_SU_DUNG) // Mặc định status khi tạo
                .build();

        // 4. Tạo Account Entity
        Account account = Account.builder()
                .user(user) // Liên kết với User vừa tạo
                .email(req.getEmail())
                .password(passwordEncoder.encode(rawPassword)) // Sử dụng mật khẩu đã được kiểm tra
                .role(role) // Role được truyền vào từ Controller
                .status(Status.DANG_SU_DUNG) // Mặc định status khi tạo
                .build();

        // 5. Lưu Account (sẽ tự động lưu User do cascading hoặc mapping)
        return accountRepository.save(account);
    }

    @Transactional
    public Account updateAccount(String id, AccountRequest req) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));

        // 1. Cập nhật thông tin trong User
        User user = account.getUser();
        user.setFullName(req.getFullName());
        user.setPhoneNumber(req.getPhoneNumber());
        user.setDateOfBirth(req.getDateOfBirth());
        user.setGender(req.getGender());
        user.setCccd(req.getCccd());
        user.setAvata(req.getAvata());

        userRepository.save(user);

        if (req.getPassword() != null && !req.getPassword().trim().isEmpty()) {
            account.setPassword(passwordEncoder.encode(req.getPassword()));
        }

        return accountRepository.save(account);
    }

    // DELETE (Soft Delete)
    public void deleteAccount(String id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));
        account.setStatus(Status.KHONG_SU_DUNG);
        accountRepository.save(account);
    }
}

import com.example.hyperstyle.dto.request.account.ChangePasswordByIDRequest;
import com.example.hyperstyle.dto.request.account.ChangePasswordRequest;
import com.example.hyperstyle.entity.Account;
import com.example.hyperstyle.infrastructure.sercurity.auth.JwtAuhenticationResponse;
import com.example.hyperstyle.infrastructure.sercurity.auth.RefreshTokenRequets;
import com.example.hyperstyle.infrastructure.sercurity.auth.SignUpRequest;
import com.example.hyperstyle.infrastructure.sercurity.auth.SigninRequest;
import com.example.hyperstyle.repository.AccountRepository;

import java.util.List;

public interface AccountService {

    List<Account>findAll ();

    Account getOneEmail(String Email);

    JwtAuhenticationResponse singIn(SigninRequest request);

    String signUp(SignUpRequest signUpRequest);

    JwtAuhenticationResponse refreshToken(RefreshTokenRequets refresh);

    String changePassword(ChangePasswordByIDRequest changePasswordByIDRequest);




}
