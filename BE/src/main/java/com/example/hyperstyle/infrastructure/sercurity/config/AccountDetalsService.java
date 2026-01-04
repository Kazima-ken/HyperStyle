package com.example.hyperstyle.infrastructure.sercurity.config;

import com.example.hyperstyle.entity.Account;
import com.example.hyperstyle.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccountDetalsService implements UserDetailsService {

    private final AccountRepository accountRepository;

    @Override
    public UserDetails loadUserByUsername(String email) {
        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Không tìm thấy tài khoản: " + email)
                );

        return org.springframework.security.core.userdetails.User.builder()
                .username(account.getEmail())   // username = email
                .password(account.getPassword())
                .authorities(account.getAuthorities())
                .build();
    }
}


