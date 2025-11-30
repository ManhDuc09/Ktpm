package com.flogin.backend.controller;

import com.flogin.backend.config.SecurityConfig;
import com.flogin.backend.entity.Product;
import com.flogin.backend.entity.User;
import com.flogin.backend.service.ProductService;
import com.flogin.backend.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
@DisplayName("Product API Integration Tests - Read All")
@Import(SecurityConfig.class)
class ProductControllerReadAllTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @MockBean
    private UserService userService;

    @Test
    @DisplayName("GET /api/products/{userId} - Read all products")
    void testGetAllProducts() throws Exception {
        // Mock User
        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setName("testuser");
        mockUser.setEmail("testuser@example.com");
        mockUser.setPassword("password");
        when(userService.findById(1L)).thenReturn(Optional.of(mockUser));

        // Mock Products
        Product product1 = new Product();
        product1.setId(1L);
        product1.setTitle("Laptop");
        product1.setDescription("High performance laptop");
        product1.setQuantity(10);
        product1.setUser(mockUser);

        Product product2 = new Product();
        product2.setId(2L);
        product2.setTitle("Mouse");
        product2.setDescription("Wireless mouse");
        product2.setQuantity(25);
        product2.setUser(mockUser);

        Product product3 = new Product();
        product3.setId(3L);
        product3.setTitle("Keyboard");
        product3.setDescription("Mechanical keyboard");
        product3.setQuantity(15);
        product3.setUser(mockUser);

        List<Product> mockList = Arrays.asList(product1, product2, product3);
        when(productService.getProductsByUser(any(User.class))).thenReturn(mockList);

        // Perform GET request
        String response = mockMvc.perform(get("/api/products/{userId}", 1L)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // In ra danh sách test
        System.out.println("Response JSON: " + response);
    }
}
