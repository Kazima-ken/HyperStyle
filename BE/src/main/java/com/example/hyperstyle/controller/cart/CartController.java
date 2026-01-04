package com.example.hyperstyle.controller.cart;

import com.example.hyperstyle.dto.cart.CartItem;
import com.example.hyperstyle.service.CartService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping("/cart")
    public String cart(Model model, HttpSession session) {
        List<CartItem> cartItems =
                (List<CartItem>) session.getAttribute("CART");

        if (cartItems == null) cartItems = new ArrayList<>();

        BigDecimal totalPrice = cartItems.stream()
                .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        model.addAttribute("cartItems", cartItems);
        model.addAttribute("totalPrice", totalPrice);

        return "cart/index";
    }

}
