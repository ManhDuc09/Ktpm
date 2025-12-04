package com.flogin.backend.controller;

import com.flogin.backend.dto.UserDTO;
import com.flogin.backend.dto.UserResponse;
import com.flogin.backend.entity.User;
import com.flogin.backend.service.UserService;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/exists")
    public ResponseEntity<Void> checkUserExists(@RequestBody UserDTO dto) {
        boolean exists = userService.findByEmail(dto.getEmail()).isPresent();
        return exists ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody UserDTO dto) {
        return ResponseEntity.ok(userService.register(dto));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDTO dto) {
        if (dto.getEmail() == null || dto.getEmail().isBlank()) {
            return ResponseEntity.badRequest()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("message", "Email is required"));
        }
        if (dto.getPassword() == null || dto.getPassword().isBlank()) {
            return ResponseEntity.badRequest()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("message", "Password is required"));
        }

        try {
            User user = userService.login(dto.getEmail(), dto.getPassword())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
            return ResponseEntity.ok(new UserResponse(user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).build();
        }
    }
}
