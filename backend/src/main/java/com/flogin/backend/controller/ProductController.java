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

    @PostMapping("/{userId}")
    public ResponseEntity<Product> createProduct(@PathVariable Long userId, @RequestBody ProductDTO dto) {
        User user = userService.findByEmail("email@example.com").orElseThrow(); // simplify auth
        return ResponseEntity.ok(productService.createProduct(dto, user));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Product>> getProducts(@PathVariable Long userId) {
        User user = userService.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId)); 
        return ResponseEntity.ok(productService.getProductsByUser(user));
    }
}
