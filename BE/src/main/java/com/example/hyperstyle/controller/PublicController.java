package com.example.hyperstyle.controller;

import com.example.hyperstyle.infrastructure.sercurity.auth.JwtAuhtResponse;
import com.example.hyperstyle.infrastructure.sercurity.auth.SigninRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/public")
public class PublicController {

    @PostMapping("/login")
    public ResponseEntity<JwtAuhtResponse> signIn(
            @Valid @RequestBody SigninRequest request) {

        return ResponseEntity.ok(authenticationService.signIn(request));
    }


}
