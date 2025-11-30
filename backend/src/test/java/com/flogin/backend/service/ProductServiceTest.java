package com.flogin.backend.service;

import com.flogin.backend.dto.ProductDTO;
import com.flogin.backend.entity.Product;
import com.flogin.backend.entity.User;
import com.flogin.backend.exception.ResourceNotFoundException;
import com.flogin.backend.repository.ProductRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProductServiceTest {

    @InjectMocks
    private ProductService productService;

    @Mock
    private ProductRepository productRepository;

    private User user;
    private Product product;
    private ProductDTO dto;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        user = new User();
        user.setId(1L);
        user.setName("Alice");
        user.setEmail("alice@mail.com");

        product = new Product();
        product.setId(1L);
        product.setTitle("Test Product");
        product.setDescription("Test Description");
        product.setQuantity(10);
        product.setUser(user);

        dto = new ProductDTO();
        dto.setTitle("Test Product");
        dto.setDescription("Test Description");
        dto.setQuantity(10);
    }

    // --------------------------------------------------------
    // CREATE PRODUCT
    // --------------------------------------------------------
    @Test
    void createProduct_shouldReturnSavedProduct() {
        when(productRepository.save(any(Product.class))).thenReturn(product);

        Product saved = productService.createProduct(dto, user);

        assertNotNull(saved);
        assertEquals("Test Product", saved.getTitle());
        verify(productRepository, times(1)).save(any(Product.class));
    }

    // --------------------------------------------------------
    // GET PRODUCTS BY USER
    // --------------------------------------------------------
    @Test
    void getProductsByUser_shouldReturnList() {
        List<Product> list = Arrays.asList(product);

        when(productRepository.findByUser(user)).thenReturn(list);

        List<Product> result = productService.getProductsByUser(user);

        assertEquals(1, result.size());
        assertEquals("Test Product", result.get(0).getTitle());
    }

    // --------------------------------------------------------
    // FIND BY ID
    // --------------------------------------------------------
    @Test
    void findById_existingId_shouldReturnProduct() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        Optional<Product> result = productService.findById(1L);

        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
    }

    @Test
    void findById_notExistingId_shouldReturnEmpty() {
        when(productRepository.findById(2L)).thenReturn(Optional.empty());

        Optional<Product> result = productService.findById(2L);

        assertFalse(result.isPresent());
    }

    // --------------------------------------------------------
    // UPDATE PRODUCT
    // --------------------------------------------------------
    @Test
    void updateProduct_existingId_shouldUpdateAndReturn() {
        ProductDTO updateDto = new ProductDTO("Updated", "Updated Desc", 99);

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenReturn(product);

        Product updated = productService.updateProduct(1L, updateDto);

        assertEquals("Updated", updated.getTitle());
        verify(productRepository, times(1)).save(product);
    }

    @Test
    void updateProduct_notExistingId_shouldThrowException() {
        ProductDTO updateDto = new ProductDTO("Updated", "Updated Desc", 99);

        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> productService.updateProduct(999L, updateDto));
    }

    // --------------------------------------------------------
    // DELETE PRODUCT
    // --------------------------------------------------------
    @Test
    void deleteProduct_existingId_shouldDelete() {
        when(productRepository.existsById(1L)).thenReturn(true);

        productService.deleteProduct(1L);

        verify(productRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteProduct_notExistingId_shouldThrowException() {
        when(productRepository.existsById(999L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class,
                () -> productService.deleteProduct(999L));
    }
}
