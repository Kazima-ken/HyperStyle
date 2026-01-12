package com.example.hyperstyle.config;

import com.example.hyperstyle.infrastructure.sercurity.config.AccountDetalsService;
import com.example.hyperstyle.infrastructure.session.UserDetailToken;
import com.example.hyperstyle.service.Impl.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final AccountDetalsService accountDetalsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        if (!StringUtils.hasText(authHeader) || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String token = authHeader.substring(7).trim();

        if (token.isEmpty() || token.chars().filter(ch -> ch == '.').count() != 2) {
            filterChain.doFilter(request, response);
            return;
        }

        String userEmail;
        try {
            userEmail = jwtService.extractUsername(token);
        } catch (Exception e) {
            // token bẩn → bỏ qua
            filterChain.doFilter(request, response);
            return;
        }

        if (StringUtils.hasText(userEmail)
                && SecurityContextHolder.getContext().getAuthentication() == null) {

            UserDetails userDetails =
                    accountDetalsService.userDetailsService().loadUserByUsername(userEmail);

            if (jwtService.isTokenValid(token, userDetails)) {

                List<SimpleGrantedAuthority> authorities =
                        jwtService.extractRoles(token)
                                .stream()
                                .map(SimpleGrantedAuthority::new)
                                .toList();

                // --- BẮT ĐẦU SỬA ---

                // 1. Tạo đối tượng UserDetailToken (Custom của bạn)
                UserDetailToken customPrincipal = new UserDetailToken();
                customPrincipal.setEmail(userEmail); // Quan trọng: Set Email lấy từ Token
                // customPrincipal.setId(...); // Token không có ID nên ID sẽ là null, nhưng logic mới của bạn đã dùng Email nên ổn.

                // Nếu bạn muốn lấy ID từ DB (vì userDetails đã load xong), bạn có thể cast:
                // if (userDetails instanceof Account) { customPrincipal.setId(((Account)userDetails).getId()); }

                // 2. Truyền customPrincipal vào làm tham số đầu tiên
                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                customPrincipal, // <--- Thay userDetails bằng cái này
                                null,
                                authorities
                        );

                // --- KẾT THÚC SỬA ---

                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }

        filterChain.doFilter(request, response);
    }
}

