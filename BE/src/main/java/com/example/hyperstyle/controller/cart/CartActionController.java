package com.example.hyperstyle.controller.cart;

import com.example.hyperstyle.dto.cart.CartItem;
import com.example.hyperstyle.entity.ProductDetail;
import com.example.hyperstyle.service.ProductDetailService;
import com.example.hyperstyle.service.CartService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequiredArgsConstructor
public class CartActionController {

    private final ProductDetailService productDetailService;
    private final CartService cartService;

    @PostMapping("/cart/add")
    public String addToCart(
            @RequestParam String productDetailId,
            @RequestParam int quantity,
            HttpSession session
    ) {
        ProductDetail pd = productDetailService.getActiveById(productDetailId);

        CartItem item = new CartItem(
                pd.getId(),
                pd.getProduct().getName(),
                pd.getImageUrl(),
                pd.getColor().getName(),
                pd.getSize().getName(),
                pd.getPrice(),
                quantity
        );

        cartService.addToCart(session, item);
        return "redirect:/cart";
    }


}
