package com.flogin.backend.service;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.flogin.backend.entity.User;
import com.flogin.backend.repository.UserRepository;

import jakarta.security.auth.message.AuthException;

class AuthServiceTest {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);
        authService = new AuthService(userRepository, passwordEncoder);
    }

    @Test
    void authenticate_emailNull_shouldThrow() {
        AuthException ex = assertThrows(AuthException.class, () -> authService.authenticate(null, "password"));
        assertEquals("Email không được để trống", ex.getMessage());
    }

    @Test
    void authenticate_emailBlank_shouldThrow() {
        AuthException ex = assertThrows(AuthException.class, () -> authService.authenticate("   ", "password"));
        assertEquals("Email không được để trống", ex.getMessage());
    }

    @Test
    void authenticate_passwordNull_shouldThrow() {
        AuthException ex = assertThrows(AuthException.class, () -> authService.authenticate("user@example.com", null));
        assertEquals("Password không được để trống", ex.getMessage());
    }

    @Test
    void authenticate_passwordBlank_shouldThrow() {
        AuthException ex = assertThrows(AuthException.class, () -> authService.authenticate("user@example.com", "  "));
        assertEquals("Password không được để trống", ex.getMessage());
    }

    @Test
    void authenticate_userNotFound_shouldThrow() {
        when(userRepository.findByEmail("notfound@example.com")).thenReturn(Optional.empty());

        AuthException ex = assertThrows(AuthException.class,
                () -> authService.authenticate("notfound@example.com", "password"));
        assertEquals("Username không tồn tại", ex.getMessage());
    }

    @Test
    void authenticate_passwordWrong_shouldThrow() {
        User user = new User();
        user.setEmail("user@example.com");
        user.setPassword("encodedPassword");

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongPassword", "encodedPassword")).thenReturn(false);

        AuthException ex = assertThrows(AuthException.class,
                () -> authService.authenticate("user@example.com", "wrongPassword"));
        assertEquals("Password sai", ex.getMessage());
    }

    @Test
    void authenticate_success_shouldReturnUser() throws AuthException {
        User user = new User();
        user.setEmail("user@example.com");
        user.setPassword("encodedPassword");

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("correctPassword", "encodedPassword")).thenReturn(true);

        User result = authService.authenticate("user@example.com", "correctPassword");
        assertEquals(user, result);
    }
}
