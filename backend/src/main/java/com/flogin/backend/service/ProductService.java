package com.flogin.backend.service;

import com.flogin.backend.dto.ProductDTO;
import com.flogin.backend.entity.Product;
import com.flogin.backend.entity.User;
import com.flogin.backend.exception.ResourceNotFoundException;
import com.flogin.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product createProduct(ProductDTO dto, User user) {
        if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Product title must not be empty");
        }
        if (dto.getQuantity() < 0) {
            throw new IllegalArgumentException("Product quantity must be >= 0");
        }
        Product product = new Product();
        product.setTitle(dto.getTitle());
        product.setDescription(dto.getDescription());
        product.setQuantity(dto.getQuantity());
        product.setUser(user);
        return productRepository.save(product);
    }

    public List<Product> getProductsByUser(User user) {
        return productRepository.findByUser(user);
    }

    public Product updateProduct(Long id, ProductDTO dto) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Product title must not be empty");
        }
        if (dto.getQuantity() < 0) {
            throw new IllegalArgumentException("Product quantity must be >= 0");
        }
        product.setTitle(dto.getTitle());
        product.setDescription(dto.getDescription());
        product.setQuantity(dto.getQuantity());
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found");
        }
        productRepository.deleteById(id);
    }
}
