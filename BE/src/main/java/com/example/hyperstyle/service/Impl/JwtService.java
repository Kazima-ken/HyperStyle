package com.example.hyperstyle.service.Impl;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class JwtService {
    private final SecretKey secretKey;
    private final long accessTokenMs;
    private final long refreshTokenMs;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.accessTokenMs}") long accessTokenMs,
            @Value("${app.jwt.refreshTokenMs}") long refreshTokenMs
    ) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessTokenMs = accessTokenMs;
        this.refreshTokenMs = refreshTokenMs;
    }

    // Tạo token chung (access hoặc refresh)
    private String buildToken(Map<String, Object> claims, String subject, long expirationMillis) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expirationMillis);
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(secretKey, Jwts.SIG.HS256)
                .compact();
    }

    // Tạo access token (chứa role, id, fullName, avata nếu có)
    public String generateAccessToken(UserDetails userDetails, Map<String, Object> extraClaims) {
        Map<String, Object> claims = new HashMap<>(Optional.ofNullable(extraClaims).orElse(Map.of()));
        // thêm roles vào claim dưới dạng list string
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        claims.put("roles", roles);
        return buildToken(claims, userDetails.getUsername(), accessTokenMs);
    }

    // Tạo refresh token (ít claims, chỉ subject)
    public String generateRefreshToken(UserDetails userDetails) {
        return buildToken(Map.of(), userDetails.getUsername(), refreshTokenMs);
    }

    // Trích claim chung
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claimsResolver.apply(claims);
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public boolean isTokenExpired(String token) {
        try {
            Date exp = extractExpiration(token);
            return exp.before(new Date());
        } catch (Exception e) {
            return true; // nếu parse lỗi thì coi là expired/invalid
        }
    }

    // Validate token với UserDetails
    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            String username = extractUsername(token);
            return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    // Kiểm tra refresh token hợp lệ (signature + không expired)
    public boolean validateRefreshToken(String token) {
        try {
            // parse sẽ throw nếu signature sai
            extractClaim(token, c -> c);
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }



}

