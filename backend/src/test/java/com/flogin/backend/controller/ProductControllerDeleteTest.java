package com.flogin.backend.controller;

import com.flogin.backend.config.SecurityConfig;
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
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
@DisplayName("Product API Integration Tests - Delete")
@Import({SecurityConfig.class, GlobalExceptionHandler.class}) 
class ProductControllerDeleteTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @MockBean
    private UserService userService;

    @Test
    @DisplayName("DELETE /api/products/{productId} - Xóa product thành công")
    void TC_E1_deleteProductSuccess() throws Exception {
        doNothing().when(productService).deleteProduct(eq(1L));

        mockMvc.perform(delete("/api/products/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Product deleted successfully"));
    }

    @Test
    @DisplayName("DELETE /api/products/{productId} - Product không tồn tại")
    void TC_E2_deleteProductNotFound() throws Exception {
        doThrow(new ResourceNotFoundException("Product not found"))
                .when(productService).deleteProduct(eq(999L));

        mockMvc.perform(delete("/api/products/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Product not found"));
    }
}
