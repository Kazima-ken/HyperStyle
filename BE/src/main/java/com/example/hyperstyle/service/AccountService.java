package com.example.hyperstyle.service;


import com.example.hyperstyle.dto.request.account.ChangePasswordByIDRequest;
import com.example.hyperstyle.dto.response.account.AccountResponse;
import com.example.hyperstyle.dto.response.staff.StaffReduceResponse;
import com.example.hyperstyle.entity.Account;
import com.example.hyperstyle.infrastructure.sercurity.auth.JwtAuhenticationResponse;
import com.example.hyperstyle.infrastructure.sercurity.auth.RefreshTokenRequets;
import com.example.hyperstyle.infrastructure.sercurity.auth.SignUpRequest;
import com.example.hyperstyle.infrastructure.sercurity.auth.SigninRequest;

import java.util.List;

public interface AccountService {

    List<Account>getAll ();

    Account getOneEmail(String Email);

    JwtAuhenticationResponse singIn(SigninRequest request);

    String signUp(SignUpRequest signUpRequest);

    JwtAuhenticationResponse refreshToken(RefreshTokenRequets refresh);

    String changePassword(ChangePasswordByIDRequest changePasswordByIDRequest);

    List<StaffReduceResponse> getAllStaff();

    AccountResponse getByIdBill(String idBill );

}
