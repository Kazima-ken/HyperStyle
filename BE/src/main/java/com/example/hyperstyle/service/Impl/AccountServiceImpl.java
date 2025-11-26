package com.example.hyperstyle.service.Impl;

import com.example.hyperstyle.dto.request.account.ChangePasswordByIDRequest;
import com.example.hyperstyle.dto.request.account.ChangePasswordRequest;
import com.example.hyperstyle.entity.Account;
import com.example.hyperstyle.entity.User;
import com.example.hyperstyle.infrastructure.constant.Roles;
import com.example.hyperstyle.infrastructure.constant.Status;
import com.example.hyperstyle.infrastructure.exception.rest.RestApiException;
import com.example.hyperstyle.infrastructure.sercurity.auth.JwtAuhenticationResponse;
import com.example.hyperstyle.infrastructure.sercurity.auth.RefreshTokenRequets;
import com.example.hyperstyle.infrastructure.sercurity.auth.SignUpRequest;
import com.example.hyperstyle.infrastructure.sercurity.auth.SigninRequest;
import com.example.hyperstyle.infrastructure.session.ShoseSession;
import com.example.hyperstyle.repository.AccountRepository;
import com.example.hyperstyle.repository.UserReposiory;
import com.example.hyperstyle.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.swing.*;
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

    private final UserReposiory userReposiory;

    private final ShoseSession shoseSession;

    @Override
    public List<Account> findAll() {
        return null;
    }

    @Override
    public Account getOneEmail(String Email) {
        return null;
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
            // Xác thực người dùng
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    request.getEmail(), request.getPassword()
            ));
        } catch (Exception e) {
            throw new RestApiException("Xác thực thất bại: " + e.getMessage());
        }

        // Lấy lại tài khoản để lấy dữ liệu mới nhất
        var account = accountRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RestApiException("Email hoặc mật khẩu không hợp lệ."));

        // Tạo token JWT
        var jwt = jwtService.generateAccessToken(account, Map.of());
        var refreshToken = jwtService.generateRefreshToken(account);


        return JwtAuhenticationResponse.builder()
                .refreshToken(refreshToken)
                .token(jwt)
                .build();
    }

    @Override
    @Transactional
    public String signUp(SignUpRequest signUpRequest) {

        boolean emailUserExists = userReposiory.existsUserByEmail(signUpRequest.getEmail());
        boolean phoneUserExists = userReposiory.existsUserByPhone(signUpRequest.getNumberPhone());

        if (emailUserExists) {
            throw new RestApiException("Email đã tồn tại");
        }
        if (phoneUserExists) {
            throw new RestApiException("Số điện thoại đã tồn tại");
        }
        User user = createUser(signUpRequest);

        boolean emailAccountExists = accountRepository.existsAccountByEmail(signUpRequest.getEmail());
        if (emailAccountExists) {
            throw new RestApiException("Tài Khoản đã tồn tại");
        }
        Account account = createAccount(signUpRequest, user);

        return "Người dùng đã được thêm vào hệ thống.";
    }

    @Override
    public JwtAuhenticationResponse refreshToken(RefreshTokenRequets refresh) {
        String userEmail = jwtService.extractUsername(refresh.getToken());
        Account account = accountRepository.findByEmail(userEmail).orElseThrow();
        if (jwtService.isTokenValid(refresh.getToken(), account)) {
            var jwt = jwtService.generateRefreshToken(account);
            return JwtAuhenticationResponse.builder()
                    .refreshToken(refresh.getToken())
                    .token(jwt)
                    .build();
        }
        return null;
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

}
