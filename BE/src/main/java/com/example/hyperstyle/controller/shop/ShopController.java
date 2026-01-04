package com.example.hyperstyle.controller.shop;

import com.example.hyperstyle.entity.ProductDetail;
import com.example.hyperstyle.repository.ProductDetailRepository;
import com.example.hyperstyle.service.ProductDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/shop")
@RequiredArgsConstructor
public class ShopController {

    @Autowired
    private ProductDetailRepository productDetailRepository;



    @GetMapping
    public String shop(Model model) {

        List<ProductDetail> products =
                productDetailRepository.findAllWithRelations();

        model.addAttribute("products", products);
        return "shop/index";
    }

    // ================= CHI TIẾT =================
    private final ProductDetailService productDetailService;

    @GetMapping("/detail/{id}")
    public String detail(@PathVariable String id, Model model) {
        ProductDetail productDetail = productDetailService.getActiveById(id);
        model.addAttribute("product", productDetail);
        return "shop/detail";
    }


    // ================= SEARCH =================
    @GetMapping("/search")
    @ResponseBody
    public List<Map<String, String>> search(@RequestParam String keyword) {

        return productDetailRepository.findAll()
                .stream()
                .filter(pd ->
                        pd.getProduct() != null &&
                                pd.getProduct().getName() != null &&
                                pd.getProduct().getName()
                                        .toLowerCase()
                                        .contains(keyword.toLowerCase())
                )
                .map(pd -> {
                    Map<String, String> m = new HashMap<>();
                    m.put("id", pd.getId());
                    m.put("name", pd.getProduct().getName());
                    return m;
                })
                .collect(Collectors.toList());
    }
}
