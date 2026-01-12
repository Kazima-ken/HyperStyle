package com.example.hyperstyle.infrastructure.session;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class ShoesSessionImpl implements ShoseSession {


    @Override
    public UserDetailToken getStaff() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null) {
            Object principal = authentication.getPrincipal();

            // In ra xem nó là Class gì
            System.out.println("Kiểu của Principal là: " + principal.getClass().getName());
            System.out.println("Giá trị Principal: " + principal.toString());

            if (principal instanceof UserDetailToken) {
                return (UserDetailToken) principal;
            }
        }
        return null;
    }

    @Override
    public UserDetailToken getCustomer() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetailToken) {
            return (UserDetailToken) authentication.getPrincipal();
        }
        return null;
    }
}
