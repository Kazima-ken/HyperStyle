package com.example.hyperstyle.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration // Đánh dấu đây là lớp cấu hình của Spring
@EnableWebSecurity // Kích hoạt tính năng bảo mật web của Spring Security
public class SecurityConfig {

    /**
     * Cung cấp Bean PasswordEncoder (BCrypt) cho việc mã hóa mật khẩu.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Cấu hình Security Filter Chain.
     * CẤU HÌNH TẠM THỜI: Tắt CSRF và cho phép MỌI request truy cập công khai
     * để bạn có thể test các API bằng Postman mà không cần đăng nhập.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 1. Vô hiệu hóa CSRF (Cần thiết cho REST API trừ khi bạn sử dụng session)
                .csrf(AbstractHttpConfigurer::disable)

                // 2. Cấu hình ủy quyền cho HTTP Requests
                .authorizeHttpRequests(auth -> auth
                        // Cho phép tất cả các request truy cập công khai (DÙNG ĐỂ TEST)
                        .anyRequest().permitAll()
                );

        return http.build();
    }
}