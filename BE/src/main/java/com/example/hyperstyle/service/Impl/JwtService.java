package com.example.hyperstyle.service.impl;

import com.example.hyperstyle.entity.Account;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

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
        // SECRET >= 32 KÝ TỰ
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessTokenMs = accessTokenMs;
        this.refreshTokenMs = refreshTokenMs;
    }

    /* ================== GENERATE ================== */

    // Access token cơ bản (subject = EMAIL)
    public String generateToken(Account account) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + accessTokenMs);

        return Jwts.builder()
                .subject(account.getEmail())
                .issuedAt(now)
                .expiration(exp)
                .signWith(secretKey, Jwts.SIG.HS256)
                .compact();
    }

    // Access token có thêm roles
    public String generateAccessToken(UserDetails userDetails, Map<String, Object> extraClaims) {
        Map<String, Object> claims = new HashMap<>();
        if (extraClaims != null) claims.putAll(extraClaims);

        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        claims.put("roles", roles);

        return buildToken(claims, userDetails.getUsername(), accessTokenMs);
    }

    // Refresh token (ít claims)
    public String generateRefreshToken(UserDetails userDetails) {
        return buildToken(Map.of(), userDetails.getUsername(), refreshTokenMs);
    }

    private String buildToken(Map<String, Object> claims, String subject, long expirationMs) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(now)
                .expiration(exp)
                .signWith(secretKey, Jwts.SIG.HS256)
                .compact();
    }

    /* ================== EXTRACT ================== */

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject); // EMAIL
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private <T> T extractClaim(String token, Function<Claims, T> resolver) {
        Claims claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return resolver.apply(claims);
    }

    /* ================== VALIDATE ================== */

    public boolean isTokenExpired(String token) {
        try {
            return extractExpiration(token).before(new Date());
        } catch (Exception e) {
            return true;
        }
    }

    // DÙNG CHO AUTH
    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            String email = extractUsername(token);
            return email.equals(userDetails.getUsername()) && !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    // DÙNG CHO REFRESH
    public boolean validateRefreshToken(String token) {
        try {
            extractClaim(token, c -> c); // kiểm tra chữ ký
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }
}
