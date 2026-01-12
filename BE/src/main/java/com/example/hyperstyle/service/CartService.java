package com.example.hyperstyle.service;


import com.example.hyperstyle.dto.request.CartRequest;
import com.example.hyperstyle.dto.response.CartResponse;
import com.example.hyperstyle.entity.Cart;

import java.util.List;

public interface CartService {

    Cart addToCart(CartRequest listAddToCart);

    List<CartResponse> getListCart(String idAccount);

    Integer quantityInCart(String idACcount);

    String deleteCart(String idCart);

    String deleteAllCart(String idAccount);

}
