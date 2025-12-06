package com.example.hyperstyle.service;

import com.example.hyperstyle.entity.Account;
import com.example.hyperstyle.entity.User;
import com.example.hyperstyle.infrastructure.constant.Roles;
import com.example.hyperstyle.infrastructure.constant.Status;
import com.example.hyperstyle.dto.request.AccountRequest;
import com.example.hyperstyle.repository.UserRepository;
import com.example.hyperstyle.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountServiceClass {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // READ: Lấy danh sách chung
    public List<Account> getAllByRoles(Roles roles) {
        return accountRepository.findByRoles(roles);
    }

    // CREATE: Thêm mới (dùng chung cho NV và KH)
    @Transactional
    public Account createAccount(AccountRequest req, Roles roles) {

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
                .citizenIdentity(req.getCccd())
                .avata(req.getAvata())

                .status(Status.DANG_SU_DUNG) // Mặc định status khi tạo
                .build();

        // 4. Tạo Account Entity
        Account account = Account.builder()
                .user(user) // Liên kết với User vừa tạo
                .email(req.getEmail())
                .password(passwordEncoder.encode(rawPassword)) // Sử dụng mật khẩu đã được kiểm tra
                .roles(roles) // Role được truyền vào từ Controller
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
        user.setCitizenIdentity(req.getCccd());
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