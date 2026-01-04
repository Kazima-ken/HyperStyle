package com.example.hyperstyle.controller.checkout;

import com.example.hyperstyle.service.CartService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequiredArgsConstructor
public class CheckoutController {

    private final CartService cartService;

    @GetMapping("/checkout")
    public String checkout(HttpSession session, Model model) {

        // lấy giỏ hàng từ session
        var cart = cartService.getCart(session);

        // tính tổng tiền
        long total = cart.stream()
                .mapToLong(i -> i.getPrice().longValue() * i.getQuantity())
                .sum();

        model.addAttribute("cart", cart);
        model.addAttribute("total", total);

        return "checkout/index"; // templates/checkout/index.html
    }
}
