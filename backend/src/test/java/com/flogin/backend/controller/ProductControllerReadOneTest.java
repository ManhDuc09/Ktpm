package com.flogin.backend.controller;

import com.flogin.backend.config.SecurityConfig;
import com.flogin.backend.entity.Product;
import com.flogin.backend.exception.GlobalExceptionHandler;
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

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
@DisplayName("Product API Integration Tests - Read One")
@Import({SecurityConfig.class, GlobalExceptionHandler.class})
class ProductControllerReadOneTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @MockBean
    private UserService userService;

    @Test
    @DisplayName("GET /api/products/item/{productId} - Lấy một product thành công")
    void TC_C1_getProductSuccess() throws Exception {
        Product mockProduct = new Product();
        mockProduct.setId(1L);
        mockProduct.setTitle("Single Product");
        mockProduct.setDescription("Single Desc");
        mockProduct.setQuantity(5);

        when(productService.findById(1L)).thenReturn(Optional.of(mockProduct));

        mockMvc.perform(get("/api/products/item/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Single Product"))
                .andExpect(jsonPath("$.description").value("Single Desc"))
                .andExpect(jsonPath("$.quantity").value(5));
    }

    @Test
    @DisplayName("GET /api/products/item/{productId} - Product không tồn tại")
    void TC_C2_getProductNotFound() throws Exception {
        when(productService.findById(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/products/item/999")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Product not found"));
    }
}
