package com.flogin.backend.controller;

import com.flogin.backend.dto.UserDTO;
import com.flogin.backend.entity.User;
import com.flogin.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody UserDTO dto) {
        return ResponseEntity.ok(userService.register(dto));
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody UserDTO dto) {
        return userService.login(dto.getEmail(), dto.getPassword())
                .map(user -> ResponseEntity.ok("Login successful for user: " + user.getName()))
                .orElseGet(() -> ResponseEntity.status(401).body("Invalid email or password"));
    }
}
