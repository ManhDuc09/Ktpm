package com.flogin.backend.controller;

import com.flogin.backend.dto.UserDTO;
import com.flogin.backend.dto.UserResponse;
import com.flogin.backend.entity.User;
import com.flogin.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<User> login(@RequestBody UserDTO dto) {
        return userService.login(dto.getEmail(), dto.getPassword())
                .map(user -> ResponseEntity.ok(user))
                .orElseGet(() -> ResponseEntity.status(401).build());
    }
}
