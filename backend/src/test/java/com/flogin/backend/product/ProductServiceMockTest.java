package com.flogin.backend.product;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.flogin.backend.dto.ProductDTO;
import com.flogin.backend.entity.Product;
import com.flogin.backend.entity.User;
import com.flogin.backend.repository.ProductRepository;
import com.flogin.backend.service.ProductService;
import com.flogin.backend.exception.ResourceNotFoundException;

class ProductServiceMockTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    public ProductServiceMockTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateProduct() {
        User user = new User();
        user.setId(1L);

        ProductDTO dto = new ProductDTO();
        dto.setTitle("Laptop");
        dto.setDescription("Gaming laptop");
        dto.setQuantity(10);

        Product savedProduct = new Product();
        savedProduct.setId(1L);
        savedProduct.setTitle(dto.getTitle());
        savedProduct.setDescription(dto.getDescription());
        savedProduct.setQuantity(dto.getQuantity());
        savedProduct.setUser(user);

        when(productRepository.save(any(Product.class))).thenReturn(savedProduct);

        Product result = productService.createProduct(dto, user);

        assertNotNull(result);
        assertEquals("Laptop", result.getTitle());
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    void testGetProductsByUser() {
        User user = new User();
        user.setId(1L);

        Product product1 = new Product(1L, "Laptop", "Gaming", 10, user);
        Product product2 = new Product(2L, "Phone", "Smartphone", 5, user);

        when(productRepository.findByUser(user)).thenReturn(Arrays.asList(product1, product2));

        List<Product> products = productService.getProductsByUser(user);

        assertEquals(2, products.size());
        verify(productRepository, times(1)).findByUser(user);
    }

    @Test
    void testUpdateProduct() {
        User user = new User();
        user.setId(1L);

        Product existingProduct = new Product(1L, "Old Title", "Old Description", 5, user);

        ProductDTO dto = new ProductDTO();
        dto.setTitle("New Laptop");
        dto.setDescription("Gaming laptop");
        dto.setQuantity(20);

        when(productRepository.findById(1L)).thenReturn(Optional.of(existingProduct));
        when(productRepository.save(any(Product.class))).thenAnswer(inv -> inv.getArgument(0));

        Product updated = productService.updateProduct(1L, dto);

        assertNotNull(updated);
        assertEquals("New Laptop", updated.getTitle());
        assertEquals("Gaming laptop", updated.getDescription());
        assertEquals(20, updated.getQuantity());

        verify(productRepository).findById(1L);
        verify(productRepository).save(existingProduct);
    }

    @Test
    void testDeleteProductSuccess() {
        when(productRepository.existsById(1L)).thenReturn(true);

        productService.deleteProduct(1L);

        verify(productRepository).existsById(1L);
        verify(productRepository).deleteById(1L);
    }

    @Test
    void testDeleteProductNotFound() {
        when(productRepository.existsById(1L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> productService.deleteProduct(1L));

        verify(productRepository).existsById(1L);
        verify(productRepository, never()).deleteById(anyLong());
    }
}
