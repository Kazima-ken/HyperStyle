package com.example.hyperstyle.controller.client;

import com.example.hyperstyle.dto.request.CartRequest;
import com.example.hyperstyle.service.CartService;
import com.example.hyperstyle.util.ResponseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("*")
@RequestMapping("/cart")
public class CardController {

    @Autowired
    private CartService cartService;

    @PostMapping("")
    public ResponseObject<?> addCart(@RequestBody CartRequest listAddToCart) {
        return ResponseObject.success(cartService.addToCart(listAddToCart));
    }

    @GetMapping("/{idAccount}")
    public ResponseObject<?> getListCart(@PathVariable("idAccount") String idAccount) {
        return ResponseObject.success(cartService.getListCart(idAccount));
    }

    @GetMapping("/quantityInCart/{idAccount}")
    public ResponseObject<?> getQuantityInCart(@PathVariable("idAccount") String idAccount) {
        return ResponseObject.success(cartService.quantityInCart(idAccount));
    }

    @DeleteMapping("/{idCart}")
    public ResponseObject<?> deleteCart(@PathVariable("idCart") String idCart) {
        return ResponseObject.success(cartService.deleteCart(idCart));
    }

    // 2. Xóa toàn bộ giỏ hàng của tài khoản
    @DeleteMapping("/deleteAll/{idAccount}")
    public ResponseObject<?> deleteAllCart(@PathVariable("idAccount") String idAccount) {
        return ResponseObject.success(cartService.deleteAllCart(idAccount));
    }

}
