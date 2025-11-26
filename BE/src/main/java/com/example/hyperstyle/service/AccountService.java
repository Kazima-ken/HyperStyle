package com.example.hyperstyle.service;


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




}
