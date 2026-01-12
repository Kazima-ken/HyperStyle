package com.example.hyperstyle.service.Impl;

import com.example.hyperstyle.dto.request.account.ChangePasswordByIDRequest;
import com.example.hyperstyle.dto.response.account.AccountResponse;
import com.example.hyperstyle.dto.response.staff.StaffFullResponse;
import com.example.hyperstyle.dto.response.staff.StaffReduceResponse;
import com.example.hyperstyle.entity.Account;
import com.example.hyperstyle.entity.User;
import com.example.hyperstyle.infrastructure.constant.Status;
import com.example.hyperstyle.infrastructure.exception.rest.RestApiException;
import com.example.hyperstyle.infrastructure.sercurity.auth.JwtAuhenticationResponse;
import com.example.hyperstyle.infrastructure.sercurity.auth.RefreshTokenRequets;
import com.example.hyperstyle.infrastructure.sercurity.auth.SignUpRequest;
import com.example.hyperstyle.infrastructure.sercurity.auth.SigninRequest;
import com.example.hyperstyle.infrastructure.session.ShoseSession;
import com.example.hyperstyle.repository.AccountRepository;
import com.example.hyperstyle.repository.UserReposiory;
import com.example.hyperstyle.repository.UserRepository;
import com.example.hyperstyle.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;

    private final UserRepository userReposiory;

    private final ShoseSession shoseSession;

    @Override
    public List<Account> getAll() {
        // Sử dụng phương thức có sẵn của JpaRepository
        return accountRepository.findAll();
    }

    @Override
    public Account getOneEmail(String email) {
        // Sử dụng phương thức bạn đã định nghĩa trong Repository
        return accountRepository.getOneByEmail(email);
    }

    @Override
    public JwtAuhenticationResponse singIn(SigninRequest request) {
        var check = accountRepository.getOneByEmail(request.getEmail());
        if (check == null) {
            throw new RestApiException("Tài khoản hoặc mật khẩu không đúng.");
        }

        if (!passwordEncoder.matches(request.getPassword(), check.getPassword())) {
            throw new RestApiException("Tài khoản hoặc mật khẩu không đúng.");
        }

        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    request.getEmail(), request.getPassword()
            ));
        } catch (Exception e) {
            throw new RestApiException("Xác thực thất bại: " + e.getMessage());
        }

        var account = accountRepository.getByEmail(request.getEmail())
                .orElseThrow(() -> new RestApiException("Email hoặc mật khẩu không hợp lệ."));

        var jwt = jwtService.generateAccessToken(account, Map.of());
        var refreshToken = jwtService.generateRefreshToken(account);


        return JwtAuhenticationResponse.builder()
                .refreshToken(refreshToken)
                .token(jwt)
                .idAccount(account.getId())
                .build();
    }

    @Override
    @Transactional
    public String signUp(SignUpRequest signUpRequest) {

        if (userReposiory.existsUserByEmail(signUpRequest.getEmail())) {
            throw new RestApiException("Email đã tồn tại");
        }

        if (userReposiory.existsUserByPhone(signUpRequest.getNumberPhone())) {
            throw new RestApiException("Số điện thoại đã tồn tại");
        }

        if (accountRepository.existsAccountByEmail(signUpRequest.getEmail())) {
            throw new RestApiException("Tài khoản đã tồn tại");
        }

        User user = createUser(signUpRequest);
        userReposiory.save(user);

        Account account = createAccount(signUpRequest, user);
        accountRepository.save(account);

        return "Người dùng đã được thêm vào hệ thống.";
    }


    @Override
    public JwtAuhenticationResponse refreshToken(RefreshTokenRequets refresh) {
        String userEmail = jwtService.extractUsername(refresh.getToken());
        Account account = accountRepository.getByEmail(userEmail).orElseThrow();
        if (jwtService.isTokenValid(refresh.getToken(), account)) {
            var jwt = jwtService.generateRefreshToken(account);
            return JwtAuhenticationResponse.builder()
                    .refreshToken(refresh.getToken())
                    .token(jwt)
                    .build();
        }
        return null;
    }

    @Override
    public String changePassword(ChangePasswordByIDRequest changePassword) {
        // Sử dụng Optional<Account>
        Optional<Account> accountOptional = accountRepository.findById(changePassword.getId());

        // Kiểm tra và xử lý
        if (accountOptional.isEmpty()) {
            throw new RestApiException("Tài khoản không tồn tại");
        }

        Account account = accountOptional.get();

        if (!passwordEncoder.matches(changePassword.getPassword(), account.getPassword())) {
            throw new RestApiException("Mật khẩu hiện tại không đúng");
        }

        if (passwordEncoder.matches(changePassword.getNewPassword(), account.getPassword())) {
            throw new RestApiException("Mật khẩu mới không được trùng với mật khẩu cũ");
        }

        if (!changePassword.getNewPassword().equals(changePassword.getConfirmPassword())) {
            throw new RestApiException("Xác nhận mật khẩu không khớp");
        }

        String newPasswordEncoded = passwordEncoder.encode(changePassword.getNewPassword());
        account.setPassword(newPasswordEncoded);
        accountRepository.save(account);

        return "Đổi mật khẩu thành công";
    }


    private User createUser(SignUpRequest signUpRequest) {
        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setPhoneNumber(signUpRequest.getNumberPhone());
        user.setStatus(Status.DANG_SU_DUNG);
        userReposiory.save(user);
        return user;
    }

    private Account createAccount(SignUpRequest signUpRequest, User user) {
        Account account = new Account();
        account.setEmail(signUpRequest.getEmail());
        account.setRoles(signUpRequest.getRoles());
        account.setStatus(Status.DANG_SU_DUNG);
        account.setUser(user);
        account.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        accountRepository.save(account);
        return account;
    }

    @Override
    public List<StaffFullResponse> getAllStaff() {
        return accountRepository.getAllStaff();
    }

    @Override
    public AccountResponse getByIdBill(String idBill) {
        return accountRepository.getAccountByIdBill(idBill);
    }
}
