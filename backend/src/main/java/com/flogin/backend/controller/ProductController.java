package com.flogin.backend.controller;

import com.flogin.backend.dto.ProductDTO;
import com.flogin.backend.entity.Product;
import com.flogin.backend.entity.User;
import com.flogin.backend.exception.ResourceNotFoundException;
import com.flogin.backend.service.ProductService;
import com.flogin.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;
    private final UserService userService;

    public ProductController(ProductService productService, UserService userService) {
        this.productService = productService;
        this.userService = userService;
    }

    // CREATE a new product for a user
    @PostMapping("/{userId}")
    public ResponseEntity<Product> createProduct(@PathVariable Long userId, @RequestBody ProductDTO dto) {
        User user = userService.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));
        Product product = productService.createProduct(dto, user);
        return ResponseEntity.ok(product);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Product>> getProducts(@PathVariable Long userId) {
        User user = userService.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));
        List<Product> products = productService.getProductsByUser(user);
        return ResponseEntity.ok(products);
    }

    @PutMapping("/{productId}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long productId, @RequestBody ProductDTO dto) {
        Product updatedProduct = productService.updateProduct(productId, dto);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.ok("Product deleted successfully");
    }
}
