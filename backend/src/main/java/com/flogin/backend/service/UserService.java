package com.flogin.backend.service;

import com.flogin.backend.dto.UserDTO;
import com.flogin.backend.dto.UserResponse;
import com.flogin.backend.entity.User;
import com.flogin.backend.repository.UserRepository;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse register(UserDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        User savedUser = userRepository.save(user);

        return new UserResponse(savedUser.getId(), savedUser.getName(), savedUser.getEmail());
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User login(String email, String rawPassword) {
        if (email == null || email.isBlank())
            throw new IllegalArgumentException("Email is required");
        if (rawPassword == null || rawPassword.isBlank())
            throw new IllegalArgumentException("Password is required");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Incorrect email or password"));

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new IllegalArgumentException("Incorrect email or password");
        }
        return user;
    }

}
