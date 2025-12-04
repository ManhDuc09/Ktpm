package com.flogin.backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.flogin.backend.entity.User;
import com.flogin.backend.repository.UserRepository;

import jakarta.security.auth.message.AuthException;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User authenticate(String email, String password) throws AuthException {
        if (email == null || email.isBlank()) {
            throw new AuthException("Email không được để trống");
        }
        if (password == null || password.isBlank()) {
            throw new AuthException("Password không được để trống");
        }
        
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            throw new AuthException("Username không tồn tại");
        }
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new AuthException("Password sai");
        }
        return user;
    }
}
