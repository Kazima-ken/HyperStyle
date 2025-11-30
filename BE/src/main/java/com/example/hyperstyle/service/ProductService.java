package com.example.hyperstyle.service;
import com.example.hyperstyle.entity.Product;
import com.example.hyperstyle.infrastructure.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    @Autowired // <<< Đây là nơi yêu cầu bean ProductRepository bị thiếu
    private ProductRepository productRepository;

    // --- Các phương thức CRUD cơ bản cho Product ---

    // CREATE
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    // READ ALL
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // READ BY ID
    public Optional<Product> getProductById(String id) {
        return productRepository.findById(id);
    }

    // UPDATE
    public Product updateProduct(String id, Product productDetails) {
        return productRepository.findById(id).map(existingProduct -> {
            // Cập nhật các trường
            // existingProduct.setName(productDetails.getName());
            return productRepository.save(existingProduct);
        }).orElseThrow(() -> new RuntimeException("Product not found with id " + id));
    }

    // DELETE
    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }
}
