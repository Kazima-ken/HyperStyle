package com.example.hyperstyle.service;

import com.example.hyperstyle.dto.cart.CartItem;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CartService {

    private static final String CART_SESSION_KEY = "CART";

    public List<CartItem> getCart(HttpSession session) {
        List<CartItem> cart = (List<CartItem>) session.getAttribute(CART_SESSION_KEY);
        if (cart == null) {
            cart = new ArrayList<>();
            session.setAttribute(CART_SESSION_KEY, cart);
        }
        return cart;
    }

    public void addToCart(HttpSession session, CartItem item) {
        List<CartItem> cart = getCart(session);

        for (CartItem c : cart) {
            if (c.getProductDetailId().equals(item.getProductDetailId())) {
                c.setQuantity(c.getQuantity() + item.getQuantity());
                return;
            }
        }

        cart.add(item);
    }


    public void remove(HttpSession session, String productDetailId) {
        getCart(session)
                .removeIf(i -> i.getProductDetailId().equals(productDetailId));
    }

}
