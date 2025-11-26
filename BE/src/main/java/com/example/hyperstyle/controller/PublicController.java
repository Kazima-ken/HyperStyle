package com.example.hyperstyle.controller;

import com.example.hyperstyle.dto.request.account.ChangePasswordByIDRequest;
import com.example.hyperstyle.dto.request.account.ChangePasswordRequest;
import com.example.hyperstyle.infrastructure.exception.rest.CustomException;
import com.example.hyperstyle.infrastructure.sercurity.auth.JwtAuhenticationResponse;
import com.example.hyperstyle.infrastructure.sercurity.auth.RefreshTokenRequets;
import com.example.hyperstyle.infrastructure.sercurity.auth.SignUpRequest;
import com.example.hyperstyle.infrastructure.sercurity.auth.SigninRequest;
import com.example.hyperstyle.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.script.Bindings;

@RestController
@RequestMapping("/public")
@RequiredArgsConstructor
@CrossOrigin("*")
public class PublicController {

    private final AccountService accountService;

    @PostMapping("/login")
    public ResponseEntity<JwtAuhenticationResponse> signIn(@RequestBody SigninRequest request) {
        return ResponseEntity.ok(accountService.singIn(request));
    }

    @PostMapping("/signup")
    public String signup(@Valid @RequestBody SignUpRequest signUpRequest, BindingResult bindingResult) throws CustomException {
        if (bindingResult.hasErrors()) {
            throw new CustomException(404, bindingResult.getAllErrors());
        }
        return accountService.signUp(signUpRequest);
    }

    @PostMapping("/change-password")
    public String changePassword(@RequestBody ChangePasswordByIDRequest request) {
        accountService.changePassword(request);
        return "Đổi mật khẩu thành công";
    }

    @PostMapping("/refresh")
    public ResponseEntity<JwtAuhenticationResponse> refreshToken(@RequestBody RefreshTokenRequets requets){
        return ResponseEntity.ok(accountService.refreshToken(requets));
    }


}

