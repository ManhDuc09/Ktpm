package com.flogin.backend.service;

import com.flogin.backend.dto.ProductDTO;
import com.flogin.backend.entity.Product;
import com.flogin.backend.entity.User;
import com.flogin.backend.exception.ResourceNotFoundException;
import com.flogin.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils; // import sanitize

import java.util.List;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product createProduct(ProductDTO dto, User user) {
        Product product = new Product();
        product.setTitle(HtmlUtils.htmlEscape(dto.getTitle()));        
        product.setDescription(HtmlUtils.htmlEscape(dto.getDescription())); 
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

        product.setTitle(HtmlUtils.htmlEscape(dto.getTitle()));          
        product.setDescription(HtmlUtils.htmlEscape(dto.getDescription())); 
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
