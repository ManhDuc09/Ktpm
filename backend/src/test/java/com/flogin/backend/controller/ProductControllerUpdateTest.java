package com.flogin.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.backend.config.SecurityConfig;
import com.flogin.backend.dto.ProductDTO;
import com.flogin.backend.entity.Product;
import com.flogin.backend.exception.GlobalExceptionHandler;
import com.flogin.backend.exception.ResourceNotFoundException;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
@DisplayName("Product API Integration Tests - Update")
@Import({SecurityConfig.class, GlobalExceptionHandler.class})
class ProductControllerUpdateTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProductService productService;

    @MockBean
    private UserService userService;

    @Test
    @DisplayName("PUT /api/products/{productId} - Cập nhật product thành công")
    void TC_D1_updateProductSuccess() throws Exception {
        Product mockUpdated = new Product();
        mockUpdated.setId(1L);
        mockUpdated.setTitle("Updated Product");
        mockUpdated.setDescription("Updated Desc");
        mockUpdated.setQuantity(20);

        when(productService.updateProduct(eq(1L), any(ProductDTO.class)))
                .thenReturn(mockUpdated);

        mockMvc.perform(put("/api/products/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(
                        new ProductDTO("Updated Product", "Updated Desc", 20)
                )))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Updated Product"));
    }

    @Test
    @DisplayName("PUT /api/products/{productId} - Product không tồn tại")
    void TC_D2_updateProductNotFound() throws Exception {
        when(productService.updateProduct(eq(999L), any(ProductDTO.class)))
                .thenThrow(new ResourceNotFoundException("Product not found"));

        mockMvc.perform(put("/api/products/999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(
                        new ProductDTO("Test", "Desc", 5)
                )))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Product not found"));
    }
}
