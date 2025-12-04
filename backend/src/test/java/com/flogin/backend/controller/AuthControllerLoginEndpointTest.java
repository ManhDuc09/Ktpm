package com.flogin.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.backend.config.SecurityConfig;
import com.flogin.backend.dto.UserDTO;
import com.flogin.backend.entity.User;
import com.flogin.backend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@Import(SecurityConfig.class)
class AuthControllerLoginEndpointTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    private BCryptPasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        passwordEncoder = new BCryptPasswordEncoder();
    }

    @Test
    void TC_A1_successfulLogin() throws Exception {
        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setName("Test User");
        mockUser.setEmail("test@example.com");
        mockUser.setPassword(passwordEncoder.encode("123456"));

        when(userService.login("test@example.com", "123456"))
                .thenReturn(mockUser);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new UserDTO("test@example.com", "123456"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Test User"))
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    @Test
    void TC_A2_invalidEmailLogin() throws Exception {

        when(userService.login("nonexistent@example.com", "123456"))
                .thenThrow(new IllegalArgumentException("Incorrect email or password"));

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new UserDTO("nonexistent@example.com", "123456"))))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string(""));
    }

    @Test
    void TC_A3_invalidPasswordLogin() throws Exception {

        when(userService.login("test@example.com", "wrongpass"))
                .thenThrow(new IllegalArgumentException("Incorrect email or password"));

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new UserDTO("test@example.com", "wrongpass"))))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string(""));
    }

    @Test
    void TC_A4_missingEmailField() throws Exception {

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"password\":\"123456\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Email is required"));
    }

    @Test
    void TC_A5_missingPasswordField() throws Exception {

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"test@example.com\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Password is required"));
    }
}
