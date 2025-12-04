package com.flogin.backend.service;

import com.flogin.backend.dto.UserDTO;
import com.flogin.backend.dto.UserResponse;
import com.flogin.backend.entity.User;
import com.flogin.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    private UserRepository userRepository;
    private BCryptPasswordEncoder passwordEncoder;
    private UserService userService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        passwordEncoder = mock(BCryptPasswordEncoder.class);
        userService = new UserService(userRepository, passwordEncoder);
    }

    // ===== findById =====
    @Test
    void findById_existingUser_shouldReturnOptional() {
        User user = new User();
        user.setId(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        Optional<User> result = userService.findById(1L);
        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
    }

    @Test
    void findById_nonExistingUser_shouldReturnEmpty() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());
        Optional<User> result = userService.findById(999L);
        assertTrue(result.isEmpty());
    }

    // ===== findByEmail =====
    @Test
    void findByEmail_existingEmail_shouldReturnOptional() {
        User user = new User();
        user.setEmail("test@example.com");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        Optional<User> result = userService.findByEmail("test@example.com");
        assertTrue(result.isPresent());
        assertEquals("test@example.com", result.get().getEmail());
    }

    @Test
    void findByEmail_nonExistingEmail_shouldReturnEmpty() {
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());
        Optional<User> result = userService.findByEmail("missing@example.com");
        assertTrue(result.isEmpty());
    }

    // ===== register =====
    @Test
    void register_missingName_shouldThrow() {
        UserDTO dto = new UserDTO(null, "email@test.com", "password");
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> userService.register(dto));
        assertEquals("Name is required", ex.getMessage());
    }

    @Test
    void register_invalidEmail_shouldThrow() {
        UserDTO dto = new UserDTO("Name", "invalid-email", "password");
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> userService.register(dto));
        assertEquals("Invalid email format", ex.getMessage());
    }

    @Test
    void register_shortPassword_shouldThrow() {
        UserDTO dto = new UserDTO("Name", "test@example.com", "123");
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> userService.register(dto));
        assertEquals("Password must be at least 6 characters", ex.getMessage());
    }

    @Test
    void register_emailExists_shouldThrow() {
        UserDTO dto = new UserDTO("Name", "exists@example.com", "password");
        when(userRepository.existsByEmail("exists@example.com")).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> userService.register(dto));
        assertEquals("Email already exists", ex.getMessage());
    }

    @Test
    void register_success_shouldReturnUserResponse() {
        UserDTO dto = new UserDTO("Name", "new@example.com", "password");
        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("encodedPassword");

        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setName("Name");
        savedUser.setEmail("new@example.com");
        savedUser.setPassword("encodedPassword");

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        UserResponse response = userService.register(dto);

        assertEquals(1L, response.getId());
        assertEquals("Name", response.getName());
        assertEquals("new@example.com", response.getEmail());
    }
}
