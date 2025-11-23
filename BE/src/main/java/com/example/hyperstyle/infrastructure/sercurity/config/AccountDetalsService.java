package com.example.hyperstyle.infrastructure.sercurity.config;

import org.springframework.security.core.userdetails.UserDetailsService;

public interface AccountDetalsService {
    UserDetailsService userDetailsService();
}
