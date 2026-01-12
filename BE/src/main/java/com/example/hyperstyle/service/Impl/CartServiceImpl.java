package com.example.hyperstyle.service.Impl;

import com.example.hyperstyle.dto.request.CartRequest;
import com.example.hyperstyle.dto.response.CartResponse;
import com.example.hyperstyle.entity.Account;
import com.example.hyperstyle.entity.Cart;
import com.example.hyperstyle.entity.ProductDetail;
import com.example.hyperstyle.infrastructure.constant.Status;
import com.example.hyperstyle.infrastructure.exception.rest.RestApiException;
import com.example.hyperstyle.repository.AccountRepository;
import com.example.hyperstyle.repository.CartRepository;
import com.example.hyperstyle.repository.ProductDetailRepository;
import com.example.hyperstyle.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CartServiceImpl implements CartService {


    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private ProductDetailRepository productDetailRepository;


    @Override
    public Cart addToCart(CartRequest request) {

        Optional<Cart> optionalCart =
                cartRepository.findByAccount_IdAndProductDetail_Id(
                        request.getIdAccount(),
                        request.getIdProductDetail()
                );

        if (optionalCart.isPresent()) {
            Cart cart = optionalCart.get();
            cart.setQuantity(cart.getQuantity() + request.getQuantity());
            cart.setPrice(request.getPrice());
            cart.setStatus(Status.DANG_SU_DUNG);
            return cartRepository.save(cart);
        }

        Cart cart = new Cart();

        // Kiểm tra Account
        Account account = accountRepository.findById(request.getIdAccount())
                .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy tài khoản với ID: " + request.getIdAccount()));

        // Kiểm tra Product Detail
        ProductDetail productDetail = productDetailRepository.findById(request.getIdProductDetail())
                .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy chi tiết sản phẩm với ID: " + request.getIdProductDetail()));

        cart.setAccount(account);
        cart.setProductDetail(productDetail);
        cart.setQuantity(request.getQuantity());
        cart.setPrice(request.getPrice());
        cart.setStatus(Status.DANG_SU_DUNG);

        return cartRepository.save(cart);
    }


    @Override
    public List<CartResponse> getListCart(String idAccount) {
        if (!accountRepository.existsById(idAccount)) {
            throw new RestApiException("Tài khoản không tồn tại");
        }
        return cartRepository.getListCart(idAccount);
    }

    @Override
    public Integer quantityInCart(String idAccount) {
        if (!accountRepository.existsById(idAccount)) {
            throw new RestApiException("Tài khoản không tồn tại");
        }
        return cartRepository.quantityInCart(idAccount);
    }

    @Override
    public String deleteCart(String idCart) {
        // Kiểm tra xem giỏ hàng có tồn tại không
        if (cartRepository.existsById(idCart)) {
            cartRepository.deleteById(idCart);
            return "Xóa sản phẩm khỏi giỏ hàng thành công";
        } else {
            throw new RuntimeException("Lỗi: Không tìm thấy giỏ hàng với ID: " + idCart);
        }
    }

    @Override
    @Transactional // Quan trọng: Đảm bảo tính toàn vẹn dữ liệu khi xóa nhiều dòng
    public String deleteAllCart(String idAccount) {
        // Kiểm tra tài khoản
        if (!accountRepository.existsById(idAccount)) {
            throw new RuntimeException("Tài khoản không tồn tại");
        }

        // Lấy danh sách giỏ hàng của tài khoản đó
        List<Cart> cartList = cartRepository.findAllByAccount_Id(idAccount);

        if (cartList.isEmpty()) {
            return "Giỏ hàng đã trống";
        }

        // Xóa tất cả
        cartRepository.deleteAll(cartList);
        // Hoặc dùng cartRepository.deleteAllInBatch(cartList) để hiệu năng tốt hơn nếu list nhiều

        return "Xóa toàn bộ giỏ hàng thành công";
    }


}
