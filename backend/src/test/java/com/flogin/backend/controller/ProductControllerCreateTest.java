package com.flogin.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.backend.config.SecurityConfig;
import com.flogin.backend.dto.ProductDTO;
import com.flogin.backend.entity.Product;
import com.flogin.backend.entity.User;
import com.flogin.backend.service.ProductService;
import com.flogin.backend.service.UserService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
@DisplayName("Product API Integration Tests - Create")
@Import(SecurityConfig.class)
class ProductControllerCreateTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProductService productService;

    @MockBean
    private UserService userService;

    @Test
    @DisplayName("POST /api/products/{userId} - Tạo product thành công")
    void IT_TC_BE_PD_2_createProductSuccess() throws Exception {
        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setName("Test User");
        when(userService.findById(1L)).thenReturn(Optional.of(mockUser));

        Product mockProduct = new Product();
        mockProduct.setId(1L);
        mockProduct.setTitle("New Product");
        mockProduct.setDescription("Desc");
        mockProduct.setQuantity(10);
        when(productService.createProduct(any(ProductDTO.class), any(User.class))).thenReturn(mockProduct);

        mockMvc.perform(post("/api/products/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new ProductDTO("New Product", "Desc", 10))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("New Product"))
                .andExpect(jsonPath("$.description").value("Desc"))
                .andExpect(jsonPath("$.quantity").value(10));
    }
}